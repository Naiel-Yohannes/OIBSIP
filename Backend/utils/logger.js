require('dotenv').config()

const info = (...parms) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.log(...parms)
    }
}

const errorInfo = (...parms) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.log(...parms)
    }
}

module.exports = { errorInfo, info }