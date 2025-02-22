import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Importação do Prisma
import upload from "../middlewares/multer";

// Tipagem de parâmetros para o Request com params
interface Params {
  boardId?: string;
  columnId?: string;
}

// Função para pegar todos os boards
export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        columns: true, // Inclui as colunas associadas a cada board
      },
    });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar boards" });
  }
};

// Função para pegar um board específico pelo ID
export const getBoardById = async (req: Request<Params>, res: Response) => {
  const { boardId } = req.params;

  if (!boardId) {
    return res.status(400).json({ message: "ID do board não fornecido" });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: parseInt(boardId) },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                proprietario: true,
                imovel: true,
                locatario: true,
                imovelDetalhes: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board não encontrado" });
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Erro ao buscar board:", error);
    return res.status(500).json({ message: "Erro ao buscar board" });
  }
};

// Função para pegar os cards de uma coluna específica com todas as informações associadas
export const getCardsByColumn = async (req: Request<Params>, res: Response) => {
  const { columnId } = req.params;

  if (!columnId) {
    return res.status(400).json({ message: "ID da coluna não fornecido" });
  }

  try {
    const cards = await prisma.card.findMany({
      where: { columnId: parseInt(columnId) },
      include: {
        proprietario: true, // Inclui os dados do proprietário
        imovel: true, // Inclui os dados do imóvel
        locatario: true, // Inclui os dados do locatário
        imovelDetalhes: true, // Inclui os detalhes do imóvel
      },
    });

    if (!cards.length) {
      return res.status(404).json({ message: "Nenhum card encontrado para esta coluna" });
    }

    return res.status(200).json(cards);
  } catch (error) {
    console.error("Erro ao buscar cards:", error);
    return res.status(500).json({ message: "Erro ao buscar cards" });
  }
};

// Função para pegar todas as colunas e seus cards de um board específico
export const getColumnsAndCardsByBoardId = async (req: Request<Params>, res: Response) => {
  const { boardId } = req.params;

  if (!boardId) {
    return res.status(400).json({ message: "ID do board não fornecido" });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: parseInt(boardId) },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                proprietario: true,
                imovel: true,
                locatario: true,
                imovelDetalhes: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board não encontrado" });
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Erro ao buscar colunas e cards:", error);
    return res.status(500).json({ message: "Erro ao buscar colunas e cards" });
  }
};

// Função para atualizar o columnId de um card
export const moveCardToColumn = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { targetColumnId } = req.body;

  try {
    // Atualizar o card com o novo columnId
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: {
        columnId: parseInt(targetColumnId),
      },
    });

    res.status(200).json(updatedCard); // Retorna o card atualizado
  } catch (error) {
    console.error("Erro ao mover card:", error);
    res.status(500).json({ message: "Erro ao mover card" });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const board = await prisma.board.findFirst({
      include: { columns: true },
    });

    if (!board || board.columns.length === 0) {
      return res.status(400).json({ message: "Board ou colunas não encontradas." });
    }

    const primeiraColuna = board.columns[0];

    const novoCard = await prisma.card.create({
      data: {
        columnId: primeiraColuna.id, // Associar o card à primeira coluna
      },
    });

    // Retorna o cardId para ser usado nos próximos formulários
    return res.status(200).json({ cardId: novoCard.id });
  } catch (error) {
    console.error("Erro ao criar card:", error);
    return res.status(500).json({ message: "Erro ao criar card" });
  }
};

export const saveImovelToCard = async (req: Request, res: Response) => {
  const { cardId, tipoImovelSelecionado, valorAluguel, valorIptu, valorCondominio, valorGas, planoSelecionado, valorMensal, taxaSetup } =
    req.body;

  try {
    const imovel = await prisma.imovel.create({
      data: {
        tipoImovelSelecionado,
        valorAluguel: parseFloat(valorAluguel),
        valorIptu: parseFloat(valorIptu),
        valorCondominio: parseFloat(valorCondominio),
        valorGas: parseFloat(valorGas),
        planoSelecionado,
        valorMensal: parseFloat(valorMensal),
        taxaSetup: parseFloat(taxaSetup),
        card: {
          connect: { id: cardId }, // Conectando o Imóvel ao Card
        },
      },
    });

    res.status(200).json(imovel);
  } catch (error) {
    console.error("Erro ao salvar imóvel:", error);
    res.status(500).json({ message: "Erro ao salvar imóvel" });
  }
};

export const saveProprietarioToCard = async (req: Request, res: Response) => {
  const {
    cardId,
    tipoPessoa,
    cnpj,
    razaoSocial,
    estadoCivil,
    cpfConjuge,
    nomeCompleto,
    nomeCompletoConjuge,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    emailConjuge,
    telefoneConjuge,
    nacionalidadeConjuge,
    naturalidadeConjuge,
    dataNascimentoConjuge,
    rgConjuge,
    orgaoExpedidorConjuge,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  console.log("CardId:", cardId);
  console.log("Dados do Proprietário:", req.body);
  console.log("Arquivos recebidos:", files);
  try {
    const proprietario = await prisma.proprietario.create({
      data: {
        tipoPessoa,
        cnpj,
        razaoSocial,
        estadoCivil,
        cpfConjuge,
        nomeCompleto,
        nomeCompletoConjuge,
        email,
        telefone,
        nacionalidade,
        naturalidade,
        dataNascimento: new Date(dataNascimento),
        cpf,
        rg,
        orgaoExpedidor,
        emailConjuge,
        telefoneConjuge,
        nacionalidadeConjuge,
        naturalidadeConjuge,
        dataNascimentoConjuge: dataNascimentoConjuge ? new Date(dataNascimentoConjuge) : null,
        rgConjuge,
        orgaoExpedidorConjuge,
        cep,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCpfRgMotorista: files.anexoCpfRgMotorista ? files.anexoCpfRgMotorista[0].path : null,
        anexoCpfRgMotoristaConj: files.anexoCpfRgMotoristaConj ? files.anexoCpfRgMotoristaConj[0].path : null,
        anexoEstadoCivil: files.anexoEstadoCivil ? files.anexoEstadoCivil[0].path : null,
        anexoResidencia: files.anexoResidencia ? files.anexoResidencia[0].path : null,
        anexoContratoSocial: files.anexoContratoSocial ? files.anexoContratoSocial[0].path : null,
        card: {
          connect: { id: parseInt(cardId) }, // Converte cardId para inteiro
        },
      },
    });

    res.status(200).json(proprietario);
  } catch (error) {
    console.error("Erro ao salvar proprietário:", error);
    res.status(500).json({ message: "Erro ao salvar proprietário" });
  }
};

export const saveImovelDetalhesToCard = async (req: Request, res: Response) => {
  const {
    cardId,
    finalidade,
    tipoImovel,
    valorAluguel,
    valorCondominio,
    valorIptu,
    valorAgua,
    valorGas,
    administradorNome,
    administradorTelefone,
    cepImovel,
    cidade,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Converte cardId para número antes de usá-lo
    const imovelDetalhes = await prisma.imovelDetalhes.create({
      data: {
        finalidade,
        tipoImovel,
        valorAluguel: parseFloat(valorAluguel),
        valorCondominio: parseFloat(valorCondominio),
        valorIptu: valorIptu ? parseFloat(valorIptu) : null,
        valorAgua: valorAgua ? parseFloat(valorAgua) : null,
        valorGas: valorGas ? parseFloat(valorGas) : null,
        administradorNome,
        administradorTelefone,
        cepImovel,
        cidade,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCondominio: files.anexoCondominio ? files.anexoCondominio[0].path : null,
        anexoIptu: files.anexoIptu ? files.anexoIptu[0].path : null,
        anexoAgua: files.anexoAgua ? files.anexoAgua[0].path : null,
        anexoLuz: files.anexoLuz ? files.anexoLuz[0].path : null,
        anexoEscritura: files.anexoEscritura ? files.anexoEscritura[0].path : null,
        card: {
          connect: { id: parseInt(cardId) }, // Certifique-se de converter o cardId para inteiro
        },
      },
    });

    res.status(200).json(imovelDetalhes);
  } catch (error) {
    console.error("Erro ao salvar detalhes do imóvel:", error);
    res.status(500).json({ message: "Erro ao salvar detalhes do imóvel" });
  }
};

export const saveLocatarioToCard = async (req: Request, res: Response) => {
  const {
    cardId,
    tipoPessoa,
    nomeCompleto,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    estadoCivil,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    cnpj,
    razaoSocial,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const locatario = await prisma.locatario.create({
      data: {
        tipoPessoa,
        nomeCompleto,
        email,
        telefone,
        nacionalidade,
        naturalidade,
        estadoCivil,
        dataNascimento: new Date(dataNascimento),
        cpf: tipoPessoa === "Física" ? cpf : null,
        rg: tipoPessoa === "Física" ? rg : null,
        orgaoExpedidor: tipoPessoa === "Física" ? orgaoExpedidor : null,
        cnpj: tipoPessoa === "Jurídica" ? cnpj : null,
        razaoSocial: tipoPessoa === "Jurídica" ? razaoSocial : null,
        cep,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCpfRgMotoristaLocatario: files.anexoCpfRgMotoristaLocatario ? files.anexoCpfRgMotoristaLocatario[0].path : null,
        anexoEstadoCivilLocatario: files.anexoEstadoCivilLocatario ? files.anexoEstadoCivilLocatario[0].path : null,
        anexoResidenciaLocatario: files.anexoResidenciaLocatario ? files.anexoResidenciaLocatario[0].path : null,
        anexoContratoSocialLocatario: files.anexoContratoSocialLocatario ? files.anexoContratoSocialLocatario[0].path : null,
        anexoUltimoBalancoLocatario: files.anexoUltimoBalancoLocatario ? files.anexoUltimoBalancoLocatario[0].path : null,
        card: {
          connect: { id: parseInt(cardId) },
        },
      },
    });

    res.status(200).json(locatario);
  } catch (error) {
    console.error("Erro ao salvar locatário:", error);
    res.status(500).json({ message: "Erro ao salvar locatário" });
  }
};

// Função para atualizar o nome da coluna
export const updateColumnName = async (req: Request, res: Response) => {
  const { columnId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nome da coluna não fornecido" });
  }
  console.log(columnId);
  console.log(name);
  try {
    const updatedColumn = await prisma.column.update({
      where: { id: parseInt(columnId) },
      data: { name },
    });

    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error("Erro ao atualizar nome da coluna:", error);
    res.status(500).json({ message: "Erro ao atualizar nome da coluna" });
  }
};

// Função para pegar os dados do imóvel de um card específico
export const getImovelByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const imovel = await prisma.imovel.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!imovel) {
      return res.status(404).json({ message: "Imóvel não encontrado para este card" });
    }

    res.status(200).json(imovel);
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    res.status(500).json({ message: "Erro ao buscar imóvel" });
  }
};

// Função para editar as informações do imóvel
export const updateImovelByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { tipoImovelSelecionado, valorAluguel, valorIptu, valorCondominio, valorGas, planoSelecionado, valorMensal, taxaSetup } = req.body;

  try {
    const updatedImovel = await prisma.imovel.update({
      where: { cardId: parseInt(cardId) },
      data: {
        tipoImovelSelecionado,
        valorAluguel: parseFloat(valorAluguel),
        valorIptu: parseFloat(valorIptu),
        valorCondominio: parseFloat(valorCondominio),
        valorGas: parseFloat(valorGas),
        planoSelecionado,
        valorMensal: parseFloat(valorMensal),
        taxaSetup: parseFloat(taxaSetup),
      },
    });

    res.status(200).json(updatedImovel);
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    res.status(500).json({ message: "Erro ao atualizar imóvel" });
  }
};

// Função para pegar os detalhes do imóvel de um card específico
export const getImovelDetalhesByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const imovelDetalhes = await prisma.imovelDetalhes.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!imovelDetalhes) {
      return res.status(404).json({ message: "Detalhes do Imóvel não encontrados para este card" });
    }

    res.status(200).json(imovelDetalhes);
  } catch (error) {
    console.error("Erro ao buscar detalhes do imóvel:", error);
    res.status(500).json({ message: "Erro ao buscar detalhes do imóvel" });
  }
};

export const updateImovelDetalhesByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const {
    finalidade,
    tipoImovel,
    valorAluguel,
    valorCondominio,
    valorIptu,
    valorAgua,
    valorGas,
    administradorNome,
    administradorTelefone,
    cepImovel,
    cidade,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Primeiro, recuperamos os detalhes existentes do imóvel para preservar os arquivos existentes
    const existingImovelDetalhes = await prisma.imovelDetalhes.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!existingImovelDetalhes) {
      return res.status(404).json({ message: "Detalhes do Imóvel não encontrados para este card" });
    }

    const updatedImovelDetalhes = await prisma.imovelDetalhes.update({
      where: { cardId: parseInt(cardId) },
      data: {
        finalidade,
        tipoImovel,
        valorAluguel: parseFloat(valorAluguel),
        valorCondominio: parseFloat(valorCondominio),
        valorIptu: valorIptu ? parseFloat(valorIptu) : existingImovelDetalhes.valorIptu, // Preserva o valor atual se não for enviado
        valorAgua: valorAgua ? parseFloat(valorAgua) : existingImovelDetalhes.valorAgua, // Preserva o valor atual se não for enviado
        valorGas: parseFloat(valorGas),
        administradorNome,
        administradorTelefone,
        cepImovel,
        cidade,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCondominio: files.anexoCondominio ? files.anexoCondominio[0].path : existingImovelDetalhes.anexoCondominio, // Preserva o anexo atual se não for enviado
        anexoIptu: files.anexoIptu ? files.anexoIptu[0].path : existingImovelDetalhes.anexoIptu, // Preserva o anexo atual
        anexoAgua: files.anexoAgua ? files.anexoAgua[0].path : existingImovelDetalhes.anexoAgua, // Preserva o anexo atual
        anexoLuz: files.anexoLuz ? files.anexoLuz[0].path : existingImovelDetalhes.anexoLuz, // Preserva o anexo atual
        anexoEscritura: files.anexoEscritura ? files.anexoEscritura[0].path : existingImovelDetalhes.anexoEscritura, // Preserva o anexo atual
      },
    });

    res.status(200).json(updatedImovelDetalhes);
  } catch (error) {
    console.error("Erro ao atualizar detalhes do imóvel:", error);
    res.status(500).json({ message: "Erro ao atualizar detalhes do imóvel" });
  }
};

export const getProprietarioByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const proprietario = await prisma.proprietario.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!proprietario) {
      return res.status(404).json({ message: "Proprietário não encontrado para este card" });
    }

    res.status(200).json(proprietario);
  } catch (error) {
    console.error("Erro ao buscar proprietário:", error);
    res.status(500).json({ message: "Erro ao buscar proprietário" });
  }
};

export const updateProprietarioByCardId = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const {
    tipoPessoa,
    cnpj,
    razaoSocial,
    estadoCivil,
    cpfConjuge,
    nomeCompleto,
    nomeCompletoConjuge,
    email,
    telefone,
    nacionalidade,
    naturalidade,
    dataNascimento,
    cpf,
    rg,
    orgaoExpedidor,
    emailConjuge,
    telefoneConjuge,
    nacionalidadeConjuge,
    naturalidadeConjuge,
    dataNascimentoConjuge,
    rgConjuge,
    orgaoExpedidorConjuge,
    cep,
    estado,
    bairro,
    endereco,
    numero,
    complemento,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    // Primeiro, recuperamos o proprietário existente para preservar os arquivos atuais
    const existingProprietario = await prisma.proprietario.findUnique({
      where: { cardId: parseInt(cardId) },
    });

    if (!existingProprietario) {
      return res.status(404).json({ message: "Proprietário não encontrado para este card" });
    }

    const updatedProprietario = await prisma.proprietario.update({
      where: { cardId: parseInt(cardId) },
      data: {
        tipoPessoa,
        cnpj,
        razaoSocial,
        estadoCivil,
        cpfConjuge,
        nomeCompleto,
        nomeCompletoConjuge,
        email,
        telefone,
        nacionalidade,
        naturalidade,
        dataNascimento: new Date(dataNascimento),
        cpf,
        rg,
        orgaoExpedidor,
        emailConjuge,
        telefoneConjuge,
        nacionalidadeConjuge,
        naturalidadeConjuge,
        dataNascimentoConjuge: dataNascimentoConjuge ? new Date(dataNascimentoConjuge) : existingProprietario.dataNascimentoConjuge,
        rgConjuge,
        orgaoExpedidorConjuge,
        cep,
        estado,
        bairro,
        endereco,
        numero,
        complemento,
        anexoCpfRgMotorista: files.anexoCpfRgMotorista ? files.anexoCpfRgMotorista[0].path : existingProprietario.anexoCpfRgMotorista,
        anexoCpfRgMotoristaConj: files.anexoCpfRgMotoristaConj
          ? files.anexoCpfRgMotoristaConj[0].path
          : existingProprietario.anexoCpfRgMotoristaConj,
        anexoEstadoCivil: files.anexoEstadoCivil ? files.anexoEstadoCivil[0].path : existingProprietario.anexoEstadoCivil,
        anexoResidencia: files.anexoResidencia ? files.anexoResidencia[0].path : existingProprietario.anexoResidencia,
        anexoContratoSocial: files.anexoContratoSocial ? files.anexoContratoSocial[0].path : existingProprietario.anexoContratoSocial,
      },
    });

    res.status(200).json(updatedProprietario);
  } catch (error) {
    console.error("Erro ao atualizar proprietário:", error);
    res.status(500).json({ message: "Erro ao atualizar proprietário" });
  }
};

export const moveCardToBoard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { targetBoardId } = req.body;

  try {
    // Encontre a primeira coluna do board de destino
    const targetBoard = await prisma.board.findUnique({
      where: { id: parseInt(targetBoardId) },
      include: { columns: { orderBy: { id: "asc" } } },
    });

    if (!targetBoard || targetBoard.columns.length === 0) {
      return res.status(400).json({ message: "Board ou colunas não encontradas." });
    }

    const firstColumn = targetBoard.columns[0];

    // Atualize o card com o novo columnId da primeira coluna do board de destino
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: {
        columnId: firstColumn.id,
      },
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Erro ao mover card para outro board:", error);
    res.status(500).json({ message: "Erro ao mover card para outro board" });
  }
};
