// var key = "Invoice"
// var key1 = 0
// var key2 = 0
// var key3 = 0
// var key4 = 0
// var key5 = 0
// var keycount =key5 +"" + key4 +""+key3+""+key2+""+key1
// var prodArr = []

// n = 1

// var detailsBody = document.getElementById("detailsBody")
// function addDetails(){
//     key = "Invoice"
//     key1++
//     if(key1 > 9){
//         key1 = 0
//         key2++
//     }else if(key2 > 9){
//         key2 = 0
//         key3++
//     }else if(key3 > 9){
//         key3 = 0
//         key4++
//     }else if(key4 > 9){
//         key4 = 0
//         key5++
//     }
//     var keycount =key5 +"" + key4 +""+key3+""+key2+""+key1
//     var keyid = key+keycount.toString()

//     var detailsObj = {}
//     var inpDate = document.getElementById("exampleInput1")
//     var inpDesc = document.getElementById("exampleInput2")
//     var inpDebit = document.getElementById("exampleInput4")
//     var inpTotal = document.getElementById("exampleInput3")
//     var inpRemarks = document.getElementById("exampleInput5")

//     if(inpDate.value == '' || inpDesc.value == '' || inpDebit.value == '' || inpTotal.value == '' || inpRemarks.value == ''){
//         alert("Please fill all the fields!")
//         return
//     }
//     // var tr = document.createElement("tr")
//     // var th = document.createElement("td")
//     // th.setAttribute("scope",'row')
//     // th.appendChild(document.createTextNode(n))
//     // tr.appendChild(th)
//     // var td1 = document.createElement("td")
//     // var td2 = document.createElement("td")
//     // var td3 = document.createElement("td")
//     // var td4 = document.createElement("td")
//     detailsObj['date'] = inpDate.value
//     detailsObj['description'] = inpDesc.value
//     detailsObj['debit'] = inpDebit.value
//     detailsObj['total'] = inpTotal.value
//     detailsObj['remaining'] = inpTotal.value - inpDebit.value
//     detailsObj['remarks'] = inpRemarks.value
//     detailsObj['key'] = keycount
    
//     // inpDateText = document.createTextNode(inpDate)
//     // inpDescText = document.createTextNode(inpDesc)
//     // inpDebitText = document.createTextNode(inpDebit)
//     // inpCreditText = document.createTextNode(inpCredit)
    
    
//     // td1.appendChild(inpDateText)
//     // td2.appendChild(inpDescText)
//     // td3.appendChild(inpDebitText)
//     // td4.appendChild(inpCreditText)
    
//     // tr.appendChild(td1)
//     // tr.appendChild(td2)
//     // tr.appendChild(td3)
//     // tr.appendChild(td4)
//     // detailsBody.appendChild(tr)

//     console.log(detailsObj)

//     inpDate.value  = ''
//     inpDesc.value  = ''
//     inpDebit.value = ''
//     inpTotal.value  = ''
//     inpRemarks.value  = ''
//     var detail = key
//     // n = n+1

//     firebase.database().ref(detail).child(busName.split('\t')[1]).child(keyid).set(detailsObj)
//     // update()
// }
// function update(){
//     prodObj = {}
//     firebase.database().ref("Users").on("child_added",function(data){
//         var data = data.val()  
//         var totalsCredit = tCredit.innerHTML
//         var totalsDebit = tDebit.innerHTML
//         if( busName.split('\t')[1] == data.name){
//             console.log(busName.split('\t')[1])
//             key = "Users"+data.id
//             prodObj['businessid'] = data.businessid
//             prodObj["date"] = data.date
//             prodObj["id"] = data.id
//             prodObj["name"] = data.name
//             prodObj["pass"] = data.pass
//             prodObj["totalCredit"] = totalsCredit
//             prodObj["totalDebit"] = totalsDebit
//             console.log(key)
//             let refrence = 'Users/'+key
//             console.log(refrence)
            
//             firebase.database().ref(refrence).set(prodObj)
//         }
//     })
//     // firebase.database().ref('Users').child(busName.split('\t')[1]).set(detailsObj)
    
// }
// function showModal(){
//     $("#passModal").modal("show")
// }


// firebase.database().ref('Users').on("child_added",function(data){
//     var table = document.getElementById("detailsBody1")

//     var data = data.val()  
//     keycount = data.id
//     key1 = keycount[4]
//     key2 = keycount[3]
//     key3 = keycount[2]
//     key4 = keycount[1]
//     key5 = keycount[0]  

//     var prodObj = {}
//     prodObj["name"] = data.name
//     prodObj["totalCredit"] = data.totalCredit
//     prodObj["totalDebit"] = data.totalDebit
//     var bId = "business" + data.id

//     var tr = document.createElement("tr")
//     tr.setAttribute("id",bId)
//     tr.setAttribute("data-toggle",'modal')
//     tr.setAttribute("onclick","onClick(this)")
//     tr.setAttribute("data-target",'#passModal')
//     var th = document.createElement("td")
//     th.setAttribute("scope",'row')
//     th.appendChild(document.createTextNode(n))
//     tr.appendChild(th)
    
//     var td1 = document.createElement("td")
//     var td2 = document.createElement("td")
//     var td3 = document.createElement("td")
    
    
//     inpNameText = document.createTextNode(data.name)
//     inpCreText = document.createTextNode(data.totalCredit)
//     inpDebText = document.createTextNode(data.totalDebit)
    
//     td1.appendChild(inpNameText)
//     td2.appendChild(inpCreText)
//     td3.appendChild(inpDebText)
    
//     tr.appendChild(td1)
//     // tr.appendChild(td2)
//     // tr.appendChild(td3)
    
//     table.appendChild(tr)
//     // var detail = key
//     n = n+1

// })
