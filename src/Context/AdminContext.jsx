import React from 'react'
import { createContext } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db,storage } from '../Config/Firebase'
import { collection,getDoc,setDoc,doc,addDoc,getDocs, query, orderBy, deleteDoc,onSnapshot } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const AdminContext = createContext()
function AdminProvider({ children }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try{

            const fetchProducts = async () => {
                setLoading(true);
                const productdata =  collection(db, "products");
                const qua =  query(productdata, orderBy("createdAt", "desc"));
                

                const realUpdate = onSnapshot(qua,(snapquery) => {
                    const productList = snapquery.docs.map(docc => ({
                        id: docc.id,
                        name: docc.data().name,
                        price: docc.data().price,
                        image: docc.data().image,
                        ...docc.data()
                    }))



                    setProducts(productList)
                    localStorage.setItem("products", JSON.stringify(productList))
                    setLoading(false);


                    
                }) 


               return realUpdate;
            }
    


             const cache = fetchProducts()



             return () => {
                if(cache && typeof cache === 'function') cache()
             }
        }catch(error){
            console.error("Error fetching products:", error);
        }

    },[])
    


    const addProduct = async (productData, imageFile) => {
        try{
            const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const uploading = await uploadBytes(imageRef, imageFile);
            const getDownLoads = await getDownloadURL(uploading.ref);


            const productRef = collection(db, "products");
            const newProducts = {
                ...productData,
                image: getDownLoads,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const docdata = await addDoc(productRef,newProducts) 

              return { success: true, id: docdata.id }

        }catch(error){
            console.error("Error adding product:", error);
        }
    }

    const Editproduct = async (id, updatedData, imageFile) => {
        try{

            const productRef = doc(db, "products", id);
            const productSnap = await getDoc(productRef);
            const currentProduct = productSnap.data();

            let imageUrl = currentProduct?.image; 
            if (imageFile) {
                const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                const uploading = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(uploading.ref);
            }

                
                const updatedProduct = {
                    ...updatedData,
                    quantity: Number(updatedData.quantity),
                    stockquantity: updatedData.stockquantity || 0,
                    instock: Number(updatedData.quantity) > 0,
                    image: imageUrl,
                    updatedAt: new Date().toISOString()
                };
                await setDoc(productRef, updatedProduct, { merge: true });
                

                return { success: true, id };

            
        }catch(error){
            console.error("Error editing product:", error);
            return { success: false, error: error.message };
        }
    }

    const Deleteproduct = async (id) => {
        const productItem = doc(db, "products",id);
        const findProduct = await deleteDoc(productItem)
        

    }

    const values = {
        products,
        addProduct,
        Editproduct,
        setProducts,
        Deleteproduct
    }
  return (
    <AdminContext.Provider value={values}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminProvider