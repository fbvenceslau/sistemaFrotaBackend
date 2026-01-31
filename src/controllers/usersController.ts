import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth'
import { userService } from '../services/userService'

export const usersController = {
  // GET /users/current
  show: async (req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user!

    try {
      return res.json(currentUser)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // PUT /users/current
  update: async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user!
    const { firstName, lastName, phone, birth, email } = req.body 

    try {
      const updatedUser =  await userService.update(id, { firstName, lastName, phone, birth, email })
      return  res.json(updatedUser)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // PUT /users/current/password
  updatePassword: async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!
    const { currentPassword, newPassword } = req.body 
    
    user.checkPassword(currentPassword, async (err, isSame) => {
        
      try {
        if (err) return res.status(400).json({ message: err.message }) //"Erro ao verificar a senha atual."
        if (!isSame) return res.status(400).json({ message: "Senha atual incorreta." })

        await userService.updatePassword(user.id, newPassword)
        return res.status(204).json({ message: "Senha atualizada com sucesso."}) 
      } catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message })
        }
      }

    })

  }
}