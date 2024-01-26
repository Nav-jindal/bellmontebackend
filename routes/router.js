const express = require('express')
const router = new express.Router()
const nodemailer = require('nodemailer')

router.post('/register',(req,res)=>{
    const { data } = req.body;
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            port: 587,
            secure: false,
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls:{
                rejectUnauthorized: false
            }
        });
        const emailText  = `
        <h3>Order from ${data.fullName}:</h3>
        <p>
            company Name: ${data.companyName} <br/>
            email: ${data.email} <br/>
            phone Number: ${data.phone} <br/>
            vehicle Model: ${data.vehicleModel} <br/>
            container Size: ${data.containerSize} <br/>
            reeferUnit: ${data.reeferUnit} <br/>
            temperature: ${data.temperature} <br/>
            vehicle Quantity: ${data.vehicleQuantity} <br/>
        </p>
        `
        const mailOptions = {
            from: process.env.EMAIL,
            to: data.email, 
            subject: `Order from ${data.fullName}`,
            html: emailText
        }

        transporter.sendMail(mailOptions, (error, info)=>{
            if(error) {
                console.log('error: ', error)
            } else {
                console.log('email sent successfully ' + info.response)
                req.status(201).json({status:201, info})
            }
        })
    } catch (error) {
        req.status(401).json({status:401, error})
    }
})

module.exports = router