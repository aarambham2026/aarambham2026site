-- CreateTable IF NOT EXISTS
CREATE TABLE IF NOT EXISTS "Registration" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "teamLeaderName" TEXT NOT NULL,
    "rollNo" TEXT,
    "department" TEXT,
    "year" TEXT,
    "format" TEXT,
    "numberOfMembers" INTEGER NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "performanceName" TEXT,
    "performanceDuration" INTEGER NOT NULL DEFAULT 10,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "membersList" TEXT,
    "queuePosition" INTEGER NOT NULL,
    "slotStartTime" TEXT NOT NULL,
    "slotEndTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable IF NOT EXISTS
CREATE TABLE IF NOT EXISTS "EventSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "eventStartTime" TEXT NOT NULL DEFAULT '14:00',
    "eventEndTime" TEXT NOT NULL DEFAULT '17:30',
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "musicDuration" INTEGER NOT NULL DEFAULT 10,
    "danceDuration" INTEGER NOT NULL DEFAULT 10,
    "setupGap" INTEGER NOT NULL DEFAULT 2,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable IF NOT EXISTS
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL DEFAULT 'admin',
    "targetId" TEXT,
    "description" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Registration_registrationId_key" ON "Registration"("registrationId");
CREATE INDEX IF NOT EXISTS "Registration_queuePosition_idx" ON "Registration"("queuePosition");
CREATE INDEX IF NOT EXISTS "Registration_status_idx" ON "Registration"("status");
CREATE INDEX IF NOT EXISTS "Registration_eventCategory_idx" ON "Registration"("eventCategory");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
