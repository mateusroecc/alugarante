"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Adicionar useSearchParams
import { useToast } from "@/components/ui/use-toast"; // Importação do toast
import api from "@/services/api"; // Certifique-se de importar corretamente

const ThirdForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Obter parâmetros da URL
  const { toast } = useToast(); // Função para usar o toast

  // Obter o cardId dos parâmetros da URL
  const [cardId, setCardId] = useState<number | null>(null);

  useEffect(() => {
    const idFromParams = searchParams.get("cardId");

    console.log("ID from URL parameters:", idFromParams); // Verifique se o ID está sendo capturado

    if (!idFromParams) {
      toast({
        title: "Erro",
        description: "ID do card não encontrado. Redirecionando para o início.",
        variant: "destructive",
      });
      router.push("/"); // Redireciona para outra página
    } else {
      setCardId(parseInt(idFromParams)); // Armazena o cardId no estado
    }
  }, [router, searchParams, toast]);

  // Estados para capturar os dados de ImovelDetalhes
  const [finalidade, setFinalidade] = useState("Aluguel");
  const [tipoImovel, setTipoImovel] = useState("Residencial");
  const [valorAluguel, setValorAluguel] = useState("");
  const [valorCondominio, setValorCondominio] = useState("");
  const [valorIptu, setValorIptu] = useState("");
  const [agua, setAgua] = useState("");
  const [gas, setGas] = useState("");
  const [administradorNome, setAdministradorNome] = useState("");
  const [administradorTelefone, setAdministradorTelefone] = useState("");
  const [cepImovel, setCepImovel] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");

  // Estados para arquivos anexados
  const [anexoCondominio, setAnexoCondominio] = useState<File | undefined>(undefined);
  const [anexoIptu, setAnexoIptu] = useState<File | undefined>(undefined);
  const [anexoAgua, setAnexoAgua] = useState<File | undefined>(undefined);
  const [anexoLuz, setAnexoLuz] = useState<File | undefined>(undefined);
  const [anexoEscritura, setAnexoEscritura] = useState<File | undefined>(undefined);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!valorAluguel || !valorCondominio || !valorIptu || !cepImovel || !bairro || !endereco || !numero) {
      toast({
        title: "Erro no envio",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!cardId) {
      toast({
        title: "Erro no envio",
        description: "ID do card não está disponível.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();

    // Adiciona o cardId e os dados do formulário
    formData.append("cardId", cardId.toString());
    formData.append("finalidade", finalidade);
    formData.append("tipoImovel", tipoImovel);
    formData.append("valorAluguel", valorAluguel);
    formData.append("valorCondominio", valorCondominio);
    formData.append("valorIptu", valorIptu);
    formData.append("agua", agua);
    formData.append("gas", gas);
    formData.append("administradorNome", administradorNome);
    formData.append("administradorTelefone", administradorTelefone);
    formData.append("cepImovel", cepImovel);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("bairro", bairro);
    formData.append("endereco", endereco);
    formData.append("numero", numero);
    formData.append("complemento", complemento);

    // Adiciona os arquivos se eles existirem
    if (anexoCondominio) formData.append("anexoCondominio", anexoCondominio);
    if (anexoIptu) formData.append("anexoIptu", anexoIptu);
    if (anexoAgua) formData.append("anexoAgua", anexoAgua);
    if (anexoLuz) formData.append("anexoLuz", anexoLuz);
    if (anexoEscritura) formData.append("anexoEscritura", anexoEscritura);

    try {
      // Enviar os dados para a rota do backend
      const response = await api.post("/saveImovelDetalhesToCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Exibir toast de sucesso
      toast({
        title: "Formulário enviado",
        description: "Os dados do imóvel foram salvos com sucesso.",
        variant: "default",
      });

      // Redirecionar para o próximo formulário (locatário)
      setTimeout(() => {
        router.push(`/formulariopartetres?cardId=${cardId}`);
      }, 100);
    } catch (error) {
      // Exibir toast de erro
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Fragment>
      <LandingPageHeaderForm />
      <div className="min-h-screen flex flex-col items-center mt-10 ">
        <div className="w-full max-w-4xl ">
          <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
            {/* Campos de Finalidade e Tipo de Imóvel */}
            <div className="flex flex-col w-full">
              <label className="block mb-2">Finalidade do imóvel</label>
              <div className="relative">
                <select
                  value={finalidade}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={(e) => setFinalidade(e.target.value)}
                >
                  <option value="Aluguel">Aluguel</option>
                  <option value="Venda">Venda</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="block mb-2">Tipo de imóvel</label>
              <div className="relative">
                <select
                  value={tipoImovel}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={(e) => setTipoImovel(e.target.value)}
                >
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                </div>
              </div>
            </div>

            {/* Campos de valor do aluguel e condomínio */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Valor do aluguel</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do aluguel (Ex: 1200)"
                  value={valorAluguel}
                  onChange={(e) => setValorAluguel(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Valor do condomínio</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do condomínio (Ex: 150)"
                  value={valorCondominio}
                  onChange={(e) => setValorCondominio(e.target.value)}
                />
              </div>
            </div>

            {/* IPTU e valor do IPTU */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Valor do IPTU</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do IPTU (Ex: 300)"
                  value={valorIptu}
                  onChange={(e) => setValorIptu(e.target.value)}
                />
              </div>
            </div>

            {/* Água e Gás */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Valor da água</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor da água (Ex: 150)"
                  value={agua}
                  onChange={(e) => setAgua(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Valor do gás</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o valor do gás (Ex: 150)"
                  value={gas}
                  onChange={(e) => setGas(e.target.value)}
                />
              </div>
            </div>

            {/* Administrador do Condomínio e Telefone */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Administrador do Condomínio</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Nome do administrador"
                  value={administradorNome}
                  onChange={(e) => setAdministradorNome(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Telefone do Administrador</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Telefone do administrador"
                  value={administradorTelefone}
                  onChange={(e) => setAdministradorTelefone(e.target.value)}
                />
              </div>
            </div>

            {/* CEP, Cidade e Estado */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">CEP</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o CEP"
                  value={cepImovel}
                  onChange={(e) => setCepImovel(e.target.value)}
                />
              </div>
            </div>
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Cidade</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite a cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Estado</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
            </div>

            {/* Bairro e Endereço */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Bairro</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Endereço</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o endereço"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            </div>

            {/* Número e Complemento */}
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Número</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o número"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2">Complemento</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>

            {/* Campos de upload de arquivo */}
            <div className="w-full">
              <label className="block mb-2">Anexar Condomínio</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoCondominio(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Anexar IPTU</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoIptu(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Anexar Comprovante de Água</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoAgua(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Anexar Comprovante de Luz</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoLuz(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Anexar Escritura do Imóvel</label>
              <input
                type="file"
                className="w-full border-[#ccc] border appearance-none rounded-2xl px-10 py-4"
                accept="image/*,application/pdf"
                onChange={(e) => setAnexoEscritura(e.target.files ? e.target.files[0] : undefined)}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit">Enviar</Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ThirdForm;
