"use client"

import { useState, useContext } from "react"
import { useQuestions } from "../contexts/QuestionsContext"
import { useAuth } from "../contexts/AuthContext"

export default function Questions() {
  const { currentUser } = useAuth()
  const { questions, addQuestion, addAnswer, deleteQuestion, deleteAnswer } = useQuestions()
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswers, setNewAnswers] = useState({})

  const handleSubmitQuestion = (e) => {
    e.preventDefault()
    if (newQuestion.trim()) {
      addQuestion(newQuestion)
      setNewQuestion("")
    }
  }

  const handleSubmitAnswer = (e, questionId) => {
    e.preventDefault()
    const answerText = newAnswers[questionId]
    if (answerText?.trim()) {
      addAnswer(questionId, answerText)
      setNewAnswers({ ...newAnswers, [questionId]: "" })
    }
  }

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(questionId)
    }
  }

  const handleDeleteAnswer = (questionId, answerId) => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      deleteAnswer(questionId, answerId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Questions & Answers</h1>

      {/* Question Form */}
      <form onSubmit={handleSubmitQuestion} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ask Question
          </button>
        </div>
      </form>

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-semibold">{question.text}</p>
                <p className="text-sm text-gray-500">
                  Asked by {question.author} on {new Date(question.timestamp).toLocaleString()}
                </p>
              </div>
              {currentUser?.isAdmin && (
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete Question
                </button>
              )}
            </div>

            {/* Answers */}
            <div className="ml-6 space-y-4">
              {question.answers.map((answer) => (
                <div key={answer.id} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-700">{answer.text}</p>
                      <p className="text-sm text-gray-500">
                        Answered by {answer.author} on {new Date(answer.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {currentUser?.isAdmin && (
                      <button
                        onClick={() => handleDeleteAnswer(question.id, answer.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete Answer
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Answer Form */}
              <form onSubmit={(e) => handleSubmitAnswer(e, question.id)} className="mt-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newAnswers[question.id] || ""}
                    onChange={(e) =>
                      setNewAnswers({ ...newAnswers, [question.id]: e.target.value })
                    }
                    placeholder="Write an answer..."
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Answer
                  </button>
                </div>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 