"use client";
import ClickSvgIcon from "@/assets/ClickIcon";
import LandingPageHeaderForm from "@/components/LandingPageHeaderForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useEffect } from "react";

const SecondForm = () => {
  const router = useRouter();
  const [isPessoaJuridica, setIsPessoaJuridica] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física");
  const [estadoCivil, setEstadoCivil] = useState("Solteiro");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [isCasado, setIsCasado] = useState(false);
  const [cpfConjuge, setCpfConjuge] = useState("");
  const [rgConjuge, setRgConjuge] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeCompletoConjuge, setnomeCompletoConjuge] = useState("");
  const [email, setEmail] = useState("");
  const [emailConjuge, setEmailConjuge] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneConjuge, setTelefoneConjuge] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [nacionalidadeConjuge, setNacionalidadeConjuge] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [naturalidadeConjuge, setNaturalidadeConjuge] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [dataNascimentoConjuge, setDataNascimentoConjuge] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [orgaoExpedidor, setOrgaoExpedidor] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [dadosFormulario, setDadosFormulario] = useState<any>(null);

  // Lidar com a mudança de seleção de tipo de pessoa
  const handleSelectChange = (e: { target: { value: any } }) => {
    const selectedValue = e.target.value;
    setTipoPessoa(selectedValue);
    setIsPessoaJuridica(selectedValue === "Pessoa jurídica");
  };

  // Lidar com a mudança de estado civil
  const handleEstadoCivilChange = (e: { target: { value: any } }) => {
    const selectedValue = e.target.value;
    setEstadoCivil(selectedValue);
    setIsCasado(selectedValue === "Casado");
  };

  useEffect(() => {
    // Recuperar os dados do localStorage ao carregar o formulário
    const dados = localStorage.getItem("dadosFormulario");
    if (dados) {
      setDadosFormulario(JSON.parse(dados));
    }
  }, []);

  // Função para lidar com o submit do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado!"); // Verifique se isso aparece no console

    // Resto do código
    const novosDados = {
      tipoPessoa,
      cnpj,
      razaoSocial,
      estadoCivil,
      cpfConjuge,
      rgConjuge,
      nomeCompleto,
      nomeCompletoConjuge,
      email,
      emailConjuge,
      telefone,
      telefoneConjuge,
      nacionalidade,
      nacionalidadeConjuge,
      naturalidade,
      naturalidadeConjuge,
      dataNascimento,
      cpf,
      rg,
      orgaoExpedidor,
      cep,
      estado,
      bairro,
      endereco,
      numero,
      complemento,
      isCasado,
    };

    const dadosAtualizados = {
      ...dadosFormulario,
      ...novosDados,
    };

    localStorage.setItem("dadosFormulario", JSON.stringify(dadosAtualizados));

    setTimeout(() => {
      // Redirecionar para a próxima página usando o router do next
      router.push("/formulariopartedois");
    }, 100);
  };

  return (
    <Fragment>
      <LandingPageHeaderForm />
      <div className="min-h-screen flex flex-col items-center mt-10 ">
        <div className="w-full max-w-4xl ">
          <div className="flex justify-between items-center mb-6 relative">
            <div className="relative z-10 flex items-center flex-col">
              <div className="bg-[#87A644] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">1</div>
              <span className="ml-2">Dados do proprietário</span>
            </div>
            <div className="relative z-10 flex items-center flex-col">
              <div className="bg-[#ccc] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">2</div>
              <span className="ml-2">Informações do imóvel</span>
            </div>
            <div className="relative z-10 flex items-center flex-col">
              <div className="bg-[#ccc] text-white w-[70px] h-[70px] rounded-full flex justify-center items-center">3</div>
              <span className="ml-2">Dados do locatário</span>
            </div>
            <div className="bar absolute w-[85%] h-[4px] bg-[#ccc] top-[37%] right-[50%] translate-x-[50%]">
              <div className="absolute w-[0%] h-full left-0 bg-[#87A644]"></div>
            </div>
          </div>

          <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
            <div className="flex  flex-col w-full">
              <label className="block mb-2">Você é pessoa física ou jurídica?</label>
              <div className="relative">
                <select
                  value={tipoPessoa}
                  className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                  onChange={handleSelectChange}
                >
                  <option value="Pessoa física">Pessoa física</option>
                  <option value="Pessoa jurídica">Pessoa jurídica</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                </div>
              </div>
            </div>

            {isPessoaJuridica && (
              <div className="flex w-full gap-4">
                <div className="w-full">
                  <label className="block mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={cnpj}
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="Digite o seu CNPJ"
                    onChange={(e) => setCnpj(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2">Razão Social</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="Digite a sua Razão Social"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="w-full">
              <label className="block mb-2">Nome completo</label>
              <input
                type="text"
                className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                placeholder="Digite o seu nome completo aqui"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">E-mail</label>
              <input
                type="email"
                className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                placeholder="Digite o seu email aqui"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2">Telefone</label>
              <input
                type="text"
                className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                placeholder="(00) 0 0000 0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Nacionalidade</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Qual a sua nacionalidade?"
                  value={nacionalidade}
                  onChange={(e) => setNacionalidade(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Naturalidade</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Qual a sua naturalidade?"
                  value={naturalidade}
                  onChange={(e) => setNaturalidade(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Estado Civil</label>
                <div className="relative">
                  <select
                    value={estadoCivil}
                    className="w-full border border-[#ccc] appearance-none rounded-2xl px-10 py-4"
                    onChange={handleEstadoCivilChange}
                  >
                    <option value="Solteiro">Solteiro</option>
                    <option value="Casado">Casado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viúvo">Viúvo</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ClickSvgIcon className="fill-[#87A644] ml-[10px]" />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="block mb-2">Data de nascimento</label>
                <input
                  type="date"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">CPF</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">RG</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu RG"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Orgão Expeditor</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu RG"
                  value={orgaoExpedidor}
                  onChange={(e) => setOrgaoExpedidor(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">CEP</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Estado</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
            </div>
            <div className="flex w-full gap-4">
              <div className="w-full">
                <label className="block mb-2">Bairro</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="block mb-2">Endereço</label>
                <input
                  type="text"
                  className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                  placeholder="Digite o seu endereço"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            </div>

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

            {isCasado && (
              <>
                <div className="w-full">
                  <label className="block mb-2">Nome completo - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="Digite o nome completo do cônjuge"
                    onChange={(e) => setnomeCompletoConjuge(e.target.value)}
                    value={nomeCompletoConjuge}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2">E-mail - Cônjuge</label>
                  <input
                    type="email"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="Digite o e-mail do cônjuge"
                    onChange={(e) => setEmailConjuge(e.target.value)}
                    value={emailConjuge}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2">Telefone - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="(00) 0 0000 0000"
                    onChange={(e) => setTelefoneConjuge(e.target.value)}
                    value={telefoneConjuge}
                  />
                </div>

                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Nacionalidade - Cônjuge</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                      placeholder="Qual a nacionalidade do cônjuge?"
                      onChange={(e) => setNacionalidadeConjuge(e.target.value)}
                      value={nacionalidadeConjuge}
                    />
                  </div>

                  <div className="w-full">
                    <label className="block mb-2">Naturalidade - Cônjuge</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                      placeholder="Qual a naturalidade do cônjuge?"
                      onChange={(e) => setNaturalidadeConjuge(e.target.value)}
                      value={naturalidadeConjuge}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label className="block mb-2">Data de nascimento - Cônjuge</label>
                    <input
                      type="date"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                      onChange={(e) => setDataNascimentoConjuge(e.target.value)}
                      value={dataNascimentoConjuge}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2">CPF - Cônjuge</label>
                    <input
                      type="text"
                      className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                      placeholder="Digite o CPF do cônjuge"
                      onChange={(e) => setCpfConjuge(e.target.value)}
                      value={cpfConjuge}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block mb-2">RG - Cônjuge</label>
                  <input
                    type="text"
                    className="w-full border-[#ccc] border appearance-none rounded-2xl  px-10 py-4"
                    placeholder="Digite o RG do cônjuge"
                    onChange={(e) => setRgConjuge(e.target.value)}
                    value={rgConjuge}
                  />
                </div>
              </>
            )}

            <div className="col-span-2 flex justify-end">
              <Button type="submit">Enviar</Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default SecondForm;
