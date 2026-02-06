import { Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth'
import { userService } from '../services/userService'
import { License, User } from '../models'

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

  // GET /users - listar usuários com filtro por role
  listAll: async (req: AuthenticatedRequest, res: Response) => {
    const { role } = req.query

    try {
      let users
      if (role) {
        users = await User.findAll({
          where: { role: role as string },
          attributes: { exclude: ['password'] },
          include: [{
            model: License,
            as: 'license',
            required: false
          }]
        })
      } else {
        users = await User.findAll({
          attributes: { exclude: ['password'] }
        })
      }
      return res.json(users)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // GET /users/:id - detalhes do usuario
  getById: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user

      if (!currentUser) {
        return res.status(401).json({ message: 'Não autenticado' })
      }

      if (currentUser.role !== 'admin' && currentUser.role !== 'controller') {
        return res.status(403).json({ message: 'Apenas admins e controllers podem acessar usuários' })
      }

      const { id } = req.params
      const user = await User.findByPk(id, { attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      return res.json(user)
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

  // PUT /users/:id - atualizar usuario
  updateById: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user

      if (!currentUser) {
        return res.status(401).json({ message: 'Não autenticado' })
      }

      if (currentUser.role !== 'admin' && currentUser.role !== 'controller') {
        return res.status(403).json({ message: 'Apenas admins e controllers podem editar usuários' })
      }

      const { id } = req.params
      const { firstName, lastName, phone, birth, email, role, active } = req.body

      const user = await User.findByPk(id)
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      if (role && !['admin', 'controller', 'driver'].includes(role)) {
        return res.status(400).json({ message: 'Perfil inválido' })
      }

      await user.update({
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        phone: phone ?? user.phone,
        birth: birth ?? user.birth,
        email: email ?? user.email,
        role: role ?? user.role,
        active: active ?? user.active
      })

      const updated = await User.findByPk(user.id, { attributes: { exclude: ['password'] } })
      return res.json(updated)
    } catch (err: any) {
      if (err?.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Este e-mail já está cadastrado' })
      }

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

  },

  // DELETE /users/:id - inativar usuario (admin)
  remove: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user

      if (!currentUser) {
        return res.status(401).json({ message: 'Não autenticado' })
      }

      if (currentUser.role !== 'admin') {
        return res.status(403).json({ message: 'Apenas admins podem apagar usuários' })
      }

      const { id } = req.params
      const user = await User.findByPk(id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      await user.update({ active: false })
      return res.status(204).send()
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // GET /licenses - listar todas as licenças
  listAllLicenses: async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const licenses = await License.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        order: [['id', 'DESC']]
      })
      return res.json(licenses)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  }
}