# Loopwise: AI-Powered Subscription Manager

Loopwise is a modern, responsive front-end for an AI-Driven Subscription Manager that uses USDC for automated recurring payments. This project demonstrates a clean, professional, and trust-inspiring UI/UX designed for fintech and developer audiences.

---

## 📚 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Architectural Decisions](#architectural-decisions)

---

## 📌 About The Project

Loopwise is a comprehensive dashboard for managing all your personal and team subscriptions in one place. It reimagines subscription payments by leveraging the stability of USDC for seamless, automated transactions on the blockchain.

The core of Loopwise is its AI assistant, which provides intelligent suggestions to help you save money by identifying underused services, suggesting plan changes, and allowing you to manage your account with natural language commands.

### Core Principles

- **AI-First**: Leverage AI to provide proactive, valuable insights and a delightful user experience.
- **Crypto-Native**: Utilize USDC for fast, transparent, and automated recurring payments.
- **User-Centric Design**: A clean, intuitive, and responsive interface that builds trust and is a pleasure to use.
- **Security & Transparency**: Non-custodial principles and a clear audit trail for all transactions.

---

## 🚀 Key Features

- **Interactive Dashboard**: View USDC balance, active subscriptions, monthly costs, and upcoming payments with visual insights.
- **Subscription Management**: Pause, resume, cancel, or change plans with filtering by status.
- **AI Assistant**:
  - Chat-based interface for managing subscriptions.
  - Proactive suggestions to optimize spending.
- **USDC Payments**: Add funds, send USDC, and schedule future payments.
- **Team Management**: Invite members, assign roles, and manage shared subscriptions.
- **Audit Trail**: Immutable log of transactions, CSV export, and printable receipts.
- **Security & Personalization**: Profile management, session control, theme/language settings, and notification preferences.
- **Smooth Onboarding**: Multi-step authentication and profile setup for new users.

---

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) via CDN with JIT compiler
- **AI Language Model**: [Groq API](https://groq.com/) using `openai/gpt-oss-120b`
- **Payments API (Mock)**: [Circle API Sandbox](https://www.circle.com/)
- **Dependencies**: Served via CDN using `importmap` in `index.html` (no `npm` or `node_modules` required)

---

## 🧑‍💻 Getting Started

### Prerequisites

Use a modern web browser and serve files via a local web server (to avoid module restrictions).

### Installation

```sh
git clone https://github.com/your-username/loopwise.git
cd loopwise
