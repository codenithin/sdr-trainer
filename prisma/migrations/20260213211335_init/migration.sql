-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "personas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "personalitySummary" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL DEFAULT '👤',
    "traits" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "scripts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "companySize" TEXT NOT NULL,
    "targetLocation" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'intermediate',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "script_sections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scriptId" INTEGER NOT NULL,
    "sectionType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "talkingPoints" TEXT,
    "tips" TEXT,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "script_sections_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "scripts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roleplay_sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "scriptId" INTEGER NOT NULL,
    "personaId" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "feedbackSummary" TEXT,
    CONSTRAINT "roleplay_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "roleplay_sessions_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "scripts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "roleplay_sessions_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roleplay_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roleplay_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "roleplay_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
