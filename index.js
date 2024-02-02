require ('dotenv').config();
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const router = require('./routes/router')
const cors = require('cors')

const port = 5000;

app.use(express.json())
app.use(cors());
//app.use(router)
app.post('/send_email',(req,res)=>{
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
            Company Name: ${data.companyName} <br/>
            Email: ${data.email} <br/>
            Phone Number: ${data.phone} <br/>
            Vehicle Model: ${data.vehicleModel} <br/>
            Container Size: ${data.containerSize} <br/>
            ReeferUnit: ${data.reeferUnit} <br/>
            Temperature: ${data.temperature} <br/>
            Vehicle Quantity: ${data.vehicleQuantity} <br/>
            No. of Tyres: ${data.noOfTyres} <br/>
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
                console.log('email sent successfully ')
                req.status(201).json({status:201, info})
            }
        })
        } catch (error) {
            req.status(401).json({status:401, error})
        }
})

app.listen(port,()=>{
    console.log(`server start at port number: ${port}`)
})
