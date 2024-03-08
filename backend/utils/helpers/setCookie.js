import jwt from 'jsonwebtoken'

const setCookie = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
    
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameStie: 'strict'
    })

    return token;
}

export default setCookie;