"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"

const QuestionsContext = createContext()

export function useQuestions() {
  const context = useContext(QuestionsContext)
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider")
  }
  return context
}

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const { currentUser, updateUser } = useContext(AuthContext)

  // Load questions from localStorage on initial load
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || []
    setQuestions(storedQuestions)
  }, [])

  // Save questions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions))
  }, [questions])

  const addQuestion = async (text) => {
    const newQuestion = {
      id: Date.now(),
      text,
      author: currentUser.email,
      timestamp: new Date().toISOString(),
      answers: []
    }
    
    // Update questions state
    setQuestions([...questions, newQuestion])
    
    // Update user's question count
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        questions: [...(currentUser.questions || []), newQuestion.id]
      }
      await updateUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const addAnswer = (questionId, text) => {
    const newAnswer = {
      id: Date.now(),
      text,
      author: currentUser.email,
      timestamp: new Date().toISOString()
    }

    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, newAnswer] }
          : question
      )
    )
  }

  const deleteQuestion = (questionId) => {
    if (!currentUser?.isAdmin) return false
    setQuestions(questions.filter(question => question.id !== questionId))
    return true
  }

  const deleteAnswer = (questionId, answerId) => {
    if (!currentUser?.isAdmin) return false
    setQuestions(
      questions.map(question =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.filter(answer => answer.id !== answerId)
            }
          : question
      )
    )
    return true
  }

  const value = {
    questions,
    addQuestion,
    addAnswer,
    deleteQuestion,
    deleteAnswer
  }

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  )
} 