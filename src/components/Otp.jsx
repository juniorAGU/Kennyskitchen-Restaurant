import emailjs from '@emailjs/browser'

emailjs.init('g6k3a4SWme-oTVKk3')

 const otpStore = new Map();

 export const  generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
 }

 export const sendOtpByEmail = async (email,otpCode ,customername,) => {
    const templateParams = {
        to_email: email,
        to_name: customername,
        otp_code: otpCode,
        expiry_minutes: 10
    }
    try {
        const response = await emailjs.send(
            'service_81zlkea',      
            'template_rf2qdir',     
            templateParams,
            'g6k3a4SWme-oTVKk3'       
        )
        console.log('Email sent:', response)
        return true
    } catch (error) {
        console.error('Email failed:', error)
        return false
    }  
 }
 export const storeOTP = (orderId, otpCode) => {
    otpStore.set(orderId, {
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 0
    })
}

export const verifyOTP = (orderId, userOTP) => {
    const storedData = otpStore.get(orderId)
    
    if (!storedData) {
        return { valid: false, message: "OTP not found. Request a new one." }
    }
    
    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(orderId)
        return { valid: false, message: "OTP has expired. Request a new one." }
    }
    
    if (storedData.attempts >= 3) {
        otpStore.delete(orderId)
        return { valid: false, message: "Too many failed attempts. Request a new OTP." }
    }
    
    if (storedData.code !== userOTP) {
        storedData.attempts++
        return { valid: false, message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.` }
    }
    
    otpStore.delete(orderId)
    return { valid: true, message: "OTP verified successfully!" }
}