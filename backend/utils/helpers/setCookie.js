import jwt from 'jsonwebtoken'

const setCookie = (userId, res) => {

    // we will make new cookie using JWT_SECRET token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // cookie will be valid for 30days
    })
    
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days * 24 hours * 60 min * 60 sec * 1000 mili sec
        sameSite: 'strict'
    })

    return token;
}

export default setCookie;