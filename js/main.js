// Sample JSON FORMAT/RESPONSE
// {
//     "code": "3017624010701",
//     "product": {
//         "allergens_tags": [
//             "en:nuts"
//         ],
//         "brands": "Ferrero, test",
//         "image_url": "https://images.openfoodfacts.net/images/products/301/762/401/0701/front_en.54.400.jpg",
//         "ingredients_text": "sugar, palm oil, hazelnuts, skimmed milk powder, fat reduced cocoa, emulsifier, vanillin.",
//         "product_name": "Nutella",
//         "quantity": "400.0 g",
//         "traces_tags": [
//             "en:milk",
//             "en:nuts",
//             "en:soybeans"
//         ]
//     },
//     "status": 1,
//     "status_verbose": "product found"
// }


// product informations
const productImage = document.querySelector("img")
const productInput = document.querySelector("input")
const productName = document.querySelector("#product-name")
const brandQuantity = document.querySelector("#brandName")
const barCode = document.querySelector("#barcode")

// containers for allergen results 
const redTagContainer = document.querySelector(".red-tag-container")
const mayContainsTags = document.querySelector(".may-contains-tags")
const notListedTags = document.querySelector(".not-contains-tags")


// Common Allergies 
const commonAllergies = [
    "milk", "eggs", "nuts", "peanuts", "gluten",
    "soybeans", "fish", "crustaceans", "sesame-seeds"
]

document.querySelector("button").addEventListener("click",getAllergenCheck)
 

function getAllergenCheck(){
    // get the value of the input
    const productNameInp = productInput.value

    // passed all query i need to reduce the load of fetch rather than getting unnecessary details
    const url = `https://world.openfoodfacts.net/api/v2/product/${productNameInp}?fields=product_name,brands,image_url,allergens_tags,traces_tags,ingredients_text,quantity`

    fetch(url)
    .then(res=>res.json())
    .then((data)=>{
        if(data.status===1){
        console.log(data)

        //clear old results 
        redTagContainer.innerHTML = ""
        mayContainsTags.innerHTML = ""
        notListedTags.innerHTML = ""
        // left side information
      productImage.src = data.product?.image_url ?? "image/images.jpeg"
      productName.textContent = `Product:${data.product?.product_name ?? "Product Namme doesnt exist"}`
      brandQuantity.textContent = `Brand:${data.product?.brands ?? "Unknown"} . ${data.product?.quantity ?? "Unknown"}`
      barCode.textContent = `BarCode:${data.code}`

      // right side information
      const allergic = data.product.allergens_tags || []
      // check if allergic exits and has items in it
      if(allergic && allergic.length>=1){
        allergic.forEach((allergy)=>{
            // the array reponse has "en:nuts" return so i replaced the "en"
            const redAllergy = allergy.replace("en:","")

            // create as many spans are possible based on the length of the array
            const redTags = document.createElement("span")

            // set the textContent
            redTags.textContent = redAllergy

            // style applied to each red pills/tag
            redTags.classList.add("red-tag")

            // append it to the parent
            redTagContainer.append(redTags)  
        })
      }
      else{
        const noAllergy = document.createElement("p")
        noAllergy.textContent = "No Allergen"
        noAllergy.classList.add("no-allergen")
        redTagContainer.append(noAllergy)
      }

      // may contain result

    const mayContainAllergic = data.product.traces_tags || []
      // check if allergic exits and has items in it
      if(mayContainAllergic.length>=1){
        mayContainAllergic.forEach((allergy)=>{
            // the array reponse has "en:nuts" return so i replaced the "en"
            const allergyTrace = allergy.replace("en:","")

            // create as many spans are possible based on the length of the array
            const allergyTags = document.createElement("span")

            // set the textContent
            allergyTags.textContent = allergyTrace

            // style applied to each red pills/tag
            allergyTags.classList.add("yellow-tag")

            // append it to the parent
            mayContainsTags.append(allergyTags)  
        })
      } 
      else{
        const noAllergy = document.createElement("p")
        noAllergy.textContent = "No Allergen"
        noAllergy.classList.add("no-allergen")
        mayContainsTags.append(noAllergy)
      }
     
      // not listed result
      // to get the not listed allergy traces we have to loop through the commonAllergies
      // removee any that show up under "Contains" or "May contain
        const notListedTagsArray =[]

        // allergic and maycontain without "en:" tags
        
        const allergicWithoutEn = allergic.map(tag=>tag.replace("en:",""))
        const mayContainAllergicWithoutEn = mayContainAllergic.map(tag=>tag.replace("en:","")) 

        // loop through each and check if the allergy includes the allergic and maycontain array
        commonAllergies.forEach((allergy)=>{
            if(!allergicWithoutEn.includes(allergy) && !mayContainAllergicWithoutEn.includes(allergy) ){
            notListedTagsArray.push(allergy)
        }
        })
       
        
    

        if(notListedTagsArray.length>0){
            // create span pills.tag for each notlisted tags
       notListedTagsArray.forEach((allergy)=>{
    
            // create as many spans are possible based on the length of the array
            const beCarful = document.createElement("span")

            // set the textContent
            beCarful.textContent = allergy

            // style applied to each red pills/tag
            beCarful.classList.add("green-tag")

            // append it to the parent
            notListedTags.append(beCarful)  
        })
        }
        

        // ingredients section
        const ingredients = data.product.ingredients_text
        // convert it to array
        const ingredientsArray = ingredients.split(" ") 

        // check if the elements in the array includes contains the red allergy to style them df
        document.querySelector("#ingredients-list").textContent = ingredients
    }
    else{
        alert("Product not found!! Wrong Barcode")
    }
    })
    .catch(error=>console.error("error",error))

}