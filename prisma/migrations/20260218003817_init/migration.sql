-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "personalitySummary" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL DEFAULT '👤',
    "traits" TEXT NOT NULL,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scripts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "companySize" TEXT NOT NULL,
    "targetLocation" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'intermediate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script_sections" (
    "id" SERIAL NOT NULL,
    "scriptId" INTEGER NOT NULL,
    "sectionType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "talkingPoints" TEXT,
    "tips" TEXT,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "script_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roleplay_sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scriptId" INTEGER NOT NULL,
    "personaId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "feedbackSummary" TEXT,

    CONSTRAINT "roleplay_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roleplay_messages" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roleplay_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "script_sections" ADD CONSTRAINT "script_sections_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "scripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roleplay_sessions" ADD CONSTRAINT "roleplay_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roleplay_sessions" ADD CONSTRAINT "roleplay_sessions_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "scripts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roleplay_sessions" ADD CONSTRAINT "roleplay_sessions_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roleplay_messages" ADD CONSTRAINT "roleplay_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "roleplay_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
