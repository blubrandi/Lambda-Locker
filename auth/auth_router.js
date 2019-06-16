const router = require('express').Router()
const bcrypt = require('bcryptjs')

const Users = require('../locker_users/users_model.js')
const { tokenMaker } = require('../auth/auth_middleware')

router.post('/register', async (req, res) => {

    let { body } = req

    if (body && body.username && body.password && body.student_name && body.email && body.cohort && body.is_admin) {

        const { username } = body

        body.password = bcrypt.hashSync(body.password, 10)

        try {

            const check = await Users.findBy(username)

            if (!check) {

                const post = await Users.add(body)

                console.log(post)

                const user = await Users.findById(post.id)

                const token = tokenMaker(user)

                res.status(200).json(user)

            } else {
                res.status(200).json({
                    ...check,
                    notes: check.notes ? check.notes : [],
                    links: check.links ? check.links : []
                })
            }


        } catch (err) {

            console.log(err)

            res.status(500).json({
                error: 'Internal Server Error',
                err
            })

        }

    } else {
        res.status(404).json({
            error: 'You must include a username, password, student_name, email, cohort, and is_admin in your request.'
        })
    }
})

module.exports = router
