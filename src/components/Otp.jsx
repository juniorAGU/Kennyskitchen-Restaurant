import emailjs from '@emailjs/browser'
import { db } from '../Config/Firebase'
import { doc, setDoc, getDoc, updateDoc, deleteDoc,collection } from 'firebase/firestore'
import { useEffect,useState } from 'react';

emailjs.init('g6k3a4SWme-oTVKk3')

//  const [ordersotp, setOrdersOtp] = useState({})

 export const  generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
 }

 export const sendOtpByEmail = async (email,otpCode ,customername,) => {
    
    
    
    const cleanEmail = String(email).trim()
    console.log("4. Clean email:", cleanEmail)
    
    /*if (!cleanEmail || cleanEmail === "" || cleanEmail === "undefined") {
        console.error("❌ Email is invalid!")
        return false
    }*/




    const templateParams = {
        email: cleanEmail,
        to_name: customername || "Customer",
        otp_code: otpCode,
        expiry_minutes: 10
    }

    if (!email) {
        console.error("❌ No email address provided!")
        return false
    }

    try {
        const response = await emailjs.send(
            'service_81zlkea',      
            'template_rf2qdir',     
            templateParams,      
        )
        console.log("6. EmailJS response:", response)
        return true
    } catch (error) {
        console.error("❌ Error sending email:", error)
        return false
    }  
 }
 
 export const storeOTPInFirestore = async (orderId, otpCode) => {
    try{
        
        const otpsCollection = collection(db, "otps");
        
        //  Then reference the document within that collection
        const otdataRef = doc(otpsCollection, orderId);
        
        await setDoc(otdataRef,{
            code: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000, 
            attempts: 0,
            createdAt: new Date().toISOString()
        })
        console.log("OTP stored in Firebase for order:", orderId)
        return true
    } catch(err){
        console.error("Failed to store OTP in Firestore:", err)
        return false
    }
}

export const verifyOTP = async (orderId, userOTP) => {
    
    
    try {
        const otpRef = doc(db, "otps", orderId)
        const otpDoc = await getDoc(otpRef)
        
        console.log("Document exists?", otpDoc.exists())
        
        if (!otpDoc.exists()) {
            console.log("No OTP document found for this order!")
            return { valid: false, message: "OTP not found. Request a new one." }
        }
        
        const storedData = otpDoc.data()
        
        
        
        if (Date.now() > storedData.expiresAt) {
            console.log("OTP expired!")
            await deleteDoc(otpRef)
            return { valid: false, message: "OTP has expired. Request a new one." }
        }
        
        
        if (storedData.attempts >= 3) {
            console.log("Too many attempts!")
            await deleteDoc(otpRef)
            return { valid: false, message: "Too many failed attempts. Request a new OTP." }
        }
        
        
        if (storedData.code !== userOTP) {
            console.log("Code mismatch! Incrementing attempts")
            await updateDoc(otpRef, {
                attempts: storedData.attempts + 1
            })
            const remaining = 2 - storedData.attempts
            return { valid: false, message: `Invalid OTP. ${remaining} attempts remaining.` }
        }
        
        console.log("✅ OTP verified successfully!")
        await deleteDoc(otpRef)
        return { valid: true, message: "OTP verified successfully!" }
        
    } catch (error) {
        console.error("Error verifying OTP:", error)
        return { valid: false, message: "Error verifying OTP. Please try again." }
    }
}