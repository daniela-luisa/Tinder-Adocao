# 🐱 CaTinder — Sistema de Adoção de Gatinhos

**Ana Beatriz Pedrozo & Daniela Luísa da Conceição**

> Aplicação web de adoção responsável de gatos, inspirada na mecânica do Tinder.

---

## 📌 Sobre o Projeto

O **CaTinder** é uma aplicação web que transforma o processo de adoção de gatos em uma experiência intuitiva e acessível. Inspirado no funcionamento do Tinder, o sistema permite que qualquer pessoa navegue por perfis de gatinhos disponíveis para adoção, demonstre interesse com um like e, após aprovação da ONG responsável, entre em contato diretamente para concluir a adoção.

A plataforma conecta dois atores principais: **usuários** (possíveis adotantes) e **administradores** (ONGs ou responsáveis pelos animais), garantindo que o processo de adoção seja não apenas ágil, mas também responsável — com triagem humana antes de qualquer match ser confirmado.

Além do impacto social, o projeto tem como objetivo o aprendizado prático de tecnologias modernas de desenvolvimento web, muitas delas ainda não abordadas durante a graduação.

---

## 🎯 Objetivos do Sistema

- Facilitar a divulgação de gatos disponíveis para adoção
- Tornar o processo de adoção mais intuitivo, acessível e responsável
- Garantir triagem dos candidatos antes da confirmação de cada adoção
- Aplicar conceitos de desenvolvimento web full stack na prática
- Trabalhar em equipe com divisão clara de responsabilidades

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Motivo da escolha |
|---|---|
| **Sails.js** | Framework MVC com rotas e actions bem organizadas. Acelera o desenvolvimento e é uma tecnologia nova para aprendizado |
| **PostgreSQL** | Banco de dados relacional robusto, ideal para garantir integridade, consistência e suporte a transações |

### Frontend
| Tecnologia | Motivo da escolha |
|---|---|
| **React** | Biblioteca para interfaces dinâmicas com componentes reutilizáveis. Atualiza o estado sem recarregar a página e é uma tecnologia não vista na graduação |
| **Tailwind CSS** | Framework utilitário que agiliza o desenvolvimento de interfaces modernas, responsivas e visualmente consistentes |

---

## ⚙️ Funcionalidades Principais

- Cadastro e autenticação de usuários
- Navegação por cards de perfis de gatinhos com like e dislike
- Sistema de match com aprovação humana pelo administrador
- Notificação no sistema ao usuário quando um match é confirmado
- Tela **Meus Matches** com histórico de matches pendentes e concluídos
- Redirecionamento para WhatsApp com mensagem automática pré-preenchida
- Controle de status dos gatinhos (disponível, em processo de adoção, adotado)

---

## 👥 Divisão de Tarefas

### 👩‍💻 Daniela
- Responsável pela maior parte do **backend**
- Implementação das funcionalidades principais e regras de negócio
- Criação das rotas e actions no Sails.js
- Modelagem do banco de dados e garantia de integridade e transações
- Participação parcial no frontend

### 👩‍💻 Ana
- Responsável pelos **requisitos do sistema**
- Definição e validação das funcionalidades
- Responsável pela maior parte do **frontend**
- Criação das interfaces, interações com o usuário e aplicação dos estilos com Tailwind
- Participação parcial no backend

---
