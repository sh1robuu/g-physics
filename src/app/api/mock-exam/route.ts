import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

// POST /api/mock-exam — generate a mock exam from the question bank
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { count = 20, topicId, timeLimit = 45 } = body;

        const whereClause: Record<string, unknown> = {};
        if (topicId) whereClause.topicId = topicId;

        const totalQuestions = await prisma.examQuestion.count({ where: whereClause });
        if (totalQuestions === 0) {
            return NextResponse.json({ error: "No questions available" }, { status: 404 });
        }

        const questionsToFetch = Math.min(count, totalQuestions);
        const randomSkips = new Set<number>();
        while (randomSkips.size < questionsToFetch) {
            randomSkips.add(Math.floor(Math.random() * totalQuestions));
        }

        const questions = [];
        for (const skip of randomSkips) {
            const q = await prisma.examQuestion.findFirst({
                where: whereClause,
                skip,
                include: { topic: { select: { nameVi: true, name: true } } },
            });
            if (q) questions.push(q);
        }

        // Create mock test + items
        const mockTest = await prisma.mockTest.create({
            data: {
                userId: session.user.id,
                title: `Đề thi thử #${Date.now().toString(36).slice(-4).toUpperCase()}`,
                totalQuestions: questions.length,
                timeLimit,
                items: {
                    create: questions.map((q, i) => ({
                        questionId: q.id,
                        order: i + 1,
                    })),
                },
            },
        });

        return NextResponse.json({
            mockTestId: mockTest.id,
            title: mockTest.title,
            timeLimit,
            questions: questions.map((q) => {
                const opts = (q.options as Record<string, string>) || {};
                return {
                    id: q.id,
                    questionText: q.questionText,
                    questionImage: q.questionImage,
                    options: opts,
                    difficulty: q.difficulty,
                    topic: q.topic?.nameVi || q.topic?.name || "",
                };
            }),
        });
    } catch (error) {
        console.error("[MOCK_EXAM_POST]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/mock-exam — submit answers and grade
export async function PUT(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { mockTestId, answers, timeSpent } = body;

        if (!mockTestId || !answers) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        let correctCount = 0;
        const results = [];

        for (const ans of answers) {
            const question = await prisma.examQuestion.findUnique({
                where: { id: ans.questionId },
                select: { correctAnswer: true, explanation: true, questionText: true, options: true },
            });

            if (question) {
                const isCorrect = question.correctAnswer === ans.selectedAnswer;
                if (isCorrect) correctCount++;

                results.push({
                    questionId: ans.questionId,
                    questionText: question.questionText,
                    selectedAnswer: ans.selectedAnswer,
                    correctAnswer: question.correctAnswer,
                    isCorrect,
                    explanation: question.explanation,
                    options: question.options,
                });

                // Record exam attempt
                await prisma.examAttempt.create({
                    data: {
                        userId: session.user.id,
                        questionId: ans.questionId,
                        selectedAnswer: ans.selectedAnswer,
                        isCorrect,
                        timeSpent: timeSpent ? Math.round(timeSpent / answers.length) : null,
                    },
                });

                // Update mock test item
                await prisma.mockTestItem.updateMany({
                    where: { mockTestId, questionId: ans.questionId },
                    data: { selectedAnswer: ans.selectedAnswer, isCorrect },
                });
            }
        }

        // Update mock test score
        await prisma.mockTest.update({
            where: { id: mockTestId },
            data: {
                score: correctCount,
                completedAt: new Date(),
            },
        });

        const score = answers.length > 0
            ? Math.round((correctCount / answers.length) * 10 * 10) / 10
            : 0;

        return NextResponse.json({
            score,
            correctCount,
            totalQuestions: answers.length,
            timeSpent,
            results,
        });
    } catch (error) {
        console.error("[MOCK_EXAM_PUT]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
