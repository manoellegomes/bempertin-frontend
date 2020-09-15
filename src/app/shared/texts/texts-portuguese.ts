import { Injectable, OnInit } from "@angular/core";

import { Utils } from "../utils/utils";

@Injectable({
  providedIn: "root",
})
export class TextsPortuguese {
  messages = {
    requiredErrorMsg: "Campo obrigatório",
    userNotFound: "Usuário não encontrado",
    onlyDefinedUsers: "Só usuários definidos pela API conseguem se registrar",
    genericError: "Erro: Verifique os dados e tente novamente",
    passwordNotMatch: "A confirmação de senha está diferente da senha",
    formatWrong: "Formato inadequado",
    minLenghtPass: "Menor que a quantidade mínima de caracteres",
    minLenghtText: "Menor que a quantidade mínima de caracteres",
    successUpdate: "Dados atualizados com sucesso",
    errorUpdate: "Ocorreu um erro ao atualizar os dados",
  };

  constructor(private utils: Utils) {
    this.messages.minLenghtPass = `No mínimo ${this.utils.minLengthPass} caracteres`;
    this.messages.minLenghtText = `No mínimo ${this.utils.minLengthText} caracteres`;
  }

  ngOnInit() {}
}
