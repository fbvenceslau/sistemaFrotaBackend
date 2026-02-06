/**
 * Validadores de CPF e CNH
 * Backend validation utilities
 */

/**
 * Valida CPF brasileiro
 * @param cpf - String com CPF (pode conter pontos e hífen)
 * @returns boolean - true se válido
 */
export const isValidCPF = (cpf: string): boolean => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

/**
 * Valida número da CNH (espelho)
 * @param cnh - String com número da CNH (11 dígitos)
 * @returns boolean - true se válido
 */
export const isValidCNH = (cnh: string): boolean => {
  if (!cnh) return false;

  // Remove caracteres não numéricos
  const cleanCNH = cnh.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCNH.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCNH)) return false;

  // Algoritmo de validação da CNH
  let v = 0;
  let j = 9;

  // Calcula o primeiro dígito verificador
  for (let i = 0; i < 9; i++, j--) {
    v += parseInt(cleanCNH.charAt(i)) * j;
  }

  let dsc = 0;
  const firstDigit = v % 11;

  if (firstDigit >= 10) {
    dsc = 2;
  }

  v = 0;
  j = 1;

  // Calcula o segundo dígito verificador
  for (let i = 0; i < 9; i++, j++) {
    v += parseInt(cleanCNH.charAt(i)) * j;
  }

  const x = v % 11;
  const secondDigit = x >= 10 ? 0 : x - dsc;

  // Verifica os dígitos calculados
  const digit10 = parseInt(cleanCNH.charAt(9));
  const digit11 = parseInt(cleanCNH.charAt(10));

  return firstDigit === digit10 && secondDigit === digit11;
};

/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 * @param cpf - String com CPF
 * @returns string - CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNH para o padrão XXXXXXXXXXX (11 dígitos)
 * @param cnh - String com CNH
 * @returns string - CNH formatada
 */
export const formatCNH = (cnh: string): string => {
  return cnh.replace(/[^\d]/g, '').slice(0, 11);
};

/**
 * Valida telefone brasileiro
 * @param phone - String com telefone (pode conter caracteres especiais)
 * @returns boolean - true se válido (10 ou 11 dígitos)
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Aceita 10 dígitos (antigo) ou 11 dígitos (novo)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

/**
 * Formata telefone para o padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param phone - String com telefone
 * @returns string - Telefone formatado
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  if (cleanPhone.length === 11) {
    // Formato: (XX) XXXXX-XXXX
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    // Formato: (XX) XXXX-XXXX
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Mascara de telefone para input em tempo real
 * @param phone - String com telefone
 * @returns string - Telefone com máscara parcial
 */
export const maskPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  if (cleanPhone.length <= 2) {
    return cleanPhone;
  } else if (cleanPhone.length <= 6) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
  } else if (cleanPhone.length <= 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  } else {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7, 11)}`;
  }
};

/**
 * Valida CNPJ brasileiro
 * @param cnpj - String com CNPJ (pode conter pontos, barras e hífen)
 * @returns boolean - true se válido
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  if (!cnpj) return false;

  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCNPJ.charAt(12))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCNPJ.charAt(13))) return false;

  return true;
};

/**
 * Formata CNPJ para o padrão XX.XXX.XXX/XXXX-XX
 * @param cnpj - String com CNPJ
 * @returns string - CNPJ formatado
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Mascara de CNPJ para input em tempo real
 * @param cnpj - String com CNPJ
 * @returns string - CNPJ com máscara parcial
 */
export const maskCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length <= 2) {
    return cleanCNPJ;
  } else if (cleanCNPJ.length <= 5) {
    return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2)}`;
  } else if (cleanCNPJ.length <= 8) {
    return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5)}`;
  } else if (cleanCNPJ.length <= 12) {
    return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8)}`;
  } else {
    return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8, 12)}-${cleanCNPJ.slice(12, 14)}`;
  }
};

/**
 * Mascara de CPF para input em tempo real
 * @param cpf - String com CPF
 * @returns string - CPF com máscara parcial
 */
export const maskCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length <= 3) {
    return cleanCPF;
  } else if (cleanCPF.length <= 6) {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`;
  } else if (cleanCPF.length <= 9) {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`;
  } else {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`;
  }
};

/**
 * Valida CEP brasileiro
 * @param cep - String com CEP (pode conter hífen)
 * @returns boolean - true se válido
 */
export const isValidCEP = (cep: string): boolean => {
  if (!cep) return false;
  
  const cleanCEP = cep.replace(/[^\d]/g, '');
  return cleanCEP.length === 8;
};

/**
 * Formata CEP para o padrão XXXXX-XXX
 * @param cep - String com CEP
 * @returns string - CEP formatado
 */
export const formatCEP = (cep: string): string => {
  const cleanCEP = cep.replace(/[^\d]/g, '');
  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Mascara de CEP para input em tempo real
 * @param cep - String com CEP
 * @returns string - CEP com máscara parcial
 */
export const maskCEP = (cep: string): string => {
  const cleanCEP = cep.replace(/[^\d]/g, '');
  
  if (cleanCEP.length <= 5) {
    return cleanCEP;
  } else {
    return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5, 8)}`;
  }
};
