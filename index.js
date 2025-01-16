const express = require('express')
const app = express()

const {PrismaClient} = require('@prisma/client')
const cors = require("cors")

const prisma = new PrismaClient()
app.use(express.json())
app.use(cors())


// Rota para criar um Participante
app.post("/participante", async (req, res) => {                //acrescento async , assincrona, vai esperar o banco de dados confirmar para continuar
    const { name, email, presente } = req.body;

    const participantes = await prisma.participante.create({
        data:{
            name,
            email,
            presente
        }
    })
    res.status(201).json(participantes)
})


// Rota para busca  todos os participantes 
app.get('/participante', async(req, res) => {
    const participantes = await prisma.participante.findMany()
    res.json(participantes)
})

// Rota para busca  participantes presentes 
app.get("/participante/presente", async (req, res) => {             //async porque banco assincrono. Aguarda o banco responder para continuar
    const presente = req.params.presente
    const participantespresentes = await prisma.participante.findMany({where:{presente: true}})
    res.status(201).json(participantespresentes)
})

// Rota para Consultar participante faltantes
app.get("/participante/faltante", async (req, res) => {             //async porque banco assincrono. Aguarda o banco responder para continuar
    const presente = req.params.presente
    const participantesfaltantes = await prisma.participante.findMany({where:{presente: false}})
    res.status(201).json(participantesfaltantes)
})

// Rota para deletar Participante por id
app.delete("/participante/:id", async(req, res) => {            
    const id = parseInt(req.params.id)
    const participantes = await prisma.participante.findUnique({where:{id}})

    /*if(!participantes) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }*/

    await prisma.participante.delete({
        where:{id}
    })
    res.status(204).send()    
})

// Rota para alterar todas as informações do Participante
app.put("/participante/:id", async (req, res) => {        
    const id = parseInt(req.params.id)
    const participantes = await prisma.participante.findUnique({where:{id}})
    const {name, email, presente } = req.body

    const updatedUser = await prisma.participante.update({
        where: {id},
        data:{name, email, presente
        }
    })
    res.json(updatedUser)
})

// Rota para Confirmar participante presente
app.put("/participante/ConfirmaPresenca/:id", async (req, res) => {  
    const id = parseInt(req.params.id)
    const participantes = await prisma.participante.findUnique({where:{id}})

    const updatedUser = await prisma.participante.update({
        where: {id},
        data:{presente: true
        }
    })
    res.json(updatedUser)
})


// Rota para Desconfirmar participante presente
app.put("/participante/DesconfirmaPresenca/:id", async (req, res) => {    
    const id = parseInt(req.params.id)
    const participantes = await prisma.participante.findUnique({where:{id}})

    const updatedUser = await prisma.participante.update({
        where: {id},
        data:{presente: false
        }
    })
    res.json(updatedUser)
})

app.listen(3000, () => {
    console.log(`Servidor rodando em port 3000`)
})