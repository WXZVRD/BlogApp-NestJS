# 🗂 BlogApp-Ultra Backend

![NestJS](https://img.shields.io/badge/Backend-NestJS-red?logo=nestjs)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis)
![TypeORM](https://img.shields.io/badge/ORM-TypeORM-262627?logo=typeorm)
![Socket.IO](https://img.shields.io/badge/Websockets-Socket.IO-010101?logo=socketdotio)
![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?logo=swagger)
![Passport](https://img.shields.io/badge/Auth-Passport-34E27A?logo=passport)
![JWT](https://img.shields.io/badge/Security-JWT-black?logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/DevOps-Docker-2496ED?logo=docker)
![Elasticsearch](https://img.shields.io/badge/Search-Elasticsearch-005571?logo=elasticsearch)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-4285F4?logo=cloudinary)
![Jest](https://img.shields.io/badge/Tests-Jest-C21325?logo=jest)
![ESLint](https://img.shields.io/badge/Lint-ESLint-4B32C3?logo=eslint)
![Prettier](https://img.shields.io/badge/Format-Prettier-F7B93E?logo=prettier)


> **Русский:** Платформа для рецензий на фильмы, книги и мультфильмы с поддержкой markdown-разметки, комментариев, лайков и рейтингов. Встроенная админ-панель обеспечивает управление пользователями и контентом.

> **English:** A review platform for movies, books, and animations with markdown support, comments, likes, and ratings. The integrated admin panel enables full control over users and content.

---

## 🎬 Демонстрация функций / Project Demo

| GIF                                           | Описание / Description |
|-----------------------------------------------|------------------------|
| ![OAuth](./assets/BlogApp-Auth.gif)           | 🇷🇺 OAuth авторизация. <br><br> 🇺🇸 OAuth authorization. |
| ![Main Overview](./assets/BlogApp-Main1.gif) | 🇷🇺 Основной обзор приложения: главная панель управления, страницы рецензий, комментариев и пользователей. <br> 🇺🇸 Main overview of the app: dashboard, review pages, comments, and user management. |
| ![Comments & Likes](./assets/BlogApp-Comments.gif) | 🇷🇺 Создание комментариев и лайков с мгновенной синхронизацией через WebSocket. <br><br> 🇺🇸 Adding comments and likes with real-time synchronization via WebSocket. |
| ![Main Overview](./assets/BlogApp-Main2.gif) | 🇷🇺 Управление рецензиями и пользователями: редактирование, сортировка и навигация по разделам. <br><br> 🇺🇸 Managing reviews and users: editing, sorting, and navigating through sections. |
| ![Create Review](./assets/BlogApp-Create.gif) | 🇷🇺 Создание новой рецензии с поддержкой markdown и загрузки изображений. <br><br> 🇺🇸 Creating a new review with markdown support and image upload. |

## 🔹 Полное описание / Full Description

🇷🇺 Русский:
Backend ReviewApp обеспечивает платформу для публикации рецензий на фильмы, книги и мультфильмы. Поддерживаются markdown-разметка, загрузка изображений, комментарии и система лайков. Реализована система рейтингов для рецензий и произведений. Админ-панель предоставляет управление пользователями, рецензиями и контентом. Поддерживается двухфакторная аутентификация, почтовые уведомления (регистрация, подтверждение аккаунта, восстановление пароля), контроль доступа и аналитика активности. Используется WebSocket для синхронизации комментариев и лайков в реальном времени.

🇺🇸 English:
ReviewApp backend powers a platform for publishing reviews of movies, books, and animations. It supports markdown formatting, image uploads, comments, and a like system. A rating system is implemented for both reviews and works. The admin panel enables user, review, and content management. Two-factor authentication, email notifications (registration, account confirmation, password recovery), access control, and activity analytics are included. Real-time synchronization of comments and likes is handled via WebSocket.
---

## 📌 Основные фичи / Features

🇷🇺 Русский:

🔑 Авторизация: стандартная, OAuth (GitHub)<br>
📝 Рецензии: создание, редактирование и удаление с поддержкой markdown-разметки<br>
🖼 Загрузка изображений: добавление картинок в рецензии и аватары пользователей<br>
💬 Комментарии: добавление, редактирование и удаление комментариев<br>
👍 Лайки: система лайков для рецензий и комментариев<br>
⭐ Рейтинги: оценки для рецензий и произведений<br>
🔄 WebSocket: синхронизация комментариев и лайков в реальном времени<br>
🔍 Полнотекстовый поиск (Elasticsearch): гибкий поиск по рецензиям, комментариям и произведениям. Даже при ошибках в запросе или опечатках система находит релевантные результаты<br>
🔁 Модуль ElasticSync: автоматическая синхронизация данных из PostgreSQL в Elasticsearch, с динамическим созданием индексов и маппингов<br>
🛡 Контроль доступа: роли администратора и пользователя<br>
⚙️ Админ-панель: управление пользователями, рецензиями и контентом<br>
🔒 Безопасность: каптча при регистрации/логине, защита сессий<br>
📜 Документация API через Swagger и JSDoc<br>

🇺🇸 English:

🔑 Authentication: standard, OAuth (Google/Yandex), two-factor, password reset <br>
📝 Reviews: create, edit, and delete with markdown support<br>
🖼 Image uploads: add images to reviews and user avatars<br>
💬 Comments: add, edit, and delete comments<br>
👍 Likes: like system for reviews and comments<br>
⭐ Ratings: scoring system for reviews and works<br>
🔄 WebSocket: real-time sync for comments and likes<br>
🔍 Full-text search (Elasticsearch): flexible search across reviews, comments, and works. Even with typos or mistakes, the system returns relevant results<br>
🔁 ElasticSync module: automatic synchronization of PostgreSQL data to Elasticsearch with dynamic index and mapping creation<br>
🛡 Access control: admin and user roles<br>
⚙️ Admin panel: manage users, reviews, and content<br>
🔒 Security: CAPTCHA on registration/login, secure session management<br>
📜 API documentation with Swagger and JSDoc<br>

---

## 🛠 Технологии / Technologies & Tools

| Компонент / Component          | Технология / Technology |
|--------------------------------|--------------------------|
| 🌐 Ядро / Core                  | NestJS                  |
| 🗄 База данных / Database       | PostgreSQL (TypeORM)    |
| ⚡ Кеширование / Cache          | Redis + ioredis         |
| 🔍 Поиск / Search               | Elasticsearch + ElasticSync |
| 🔑 Авторизация / Auth & Sessions| Passport (JWT, OAuth2), argon2 |
| 🔄 Реальное время / Real-time   | WebSocket (Socket.IO)   |
| 🛡 Безопасность / Security      | Helmet, Captcha, Rate limiting |
| 📝 Документация / Documentation | Swagger, JSDoc          |
| 📊 Логирование / Logging        | pino, pino-pretty, nestjs-pino |
| ⚙️ Дополнительно / Additional   | RxJS, class-validator, class-transformer, compression |
