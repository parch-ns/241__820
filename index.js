const validateData = (userData) => {
    let errors = []
    if (!userData.firstname) {
        errors.push('กรุณากรอกชื้่อ')
    }
    if (!userData.lastname) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender) {
        errors.push('กรุณากรอกเพศ')
    }
    if (!userData.interest) {
        errors.push('กรุณาเลือกความสนใจ')
    }
    if (!userData.description) {
        errors.push('กรุณากรอกข้อมูลตัวเอง')
    }
    return errors
}
const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')
    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}
    let descriptionDOM = document.querySelector('textarea[name=description]')

    let messageDOM = document.getElementById('message')
    
    let interest = ''
    for (let i = 0; i < interestDOMs.length; i++ ){
        interest += interestDOMs[i].value
        if (i != interestDOMs.length - 1){
            interest += ','
        }
    }
   
    let userData = {
        firstName: firstNameDOM.value,
        lastName: lastNameDOM.value,
        age : ageDOM.value,
        gender : genderDOM.value,
        description : descriptionDOM.value,
        interests : interest

    }
    console.log('submitData',userData)

    const errors = validateData(userData)
    if (errors.length > 0) {
        throw {
            message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            errors: errors
        }
    }

    try{
        const response = await axios.post('http://localhost:8000/users',userData)
        console.log('response',response.data)
        messageDOM.innerText = 'บันทึกข้อมูลเรียร้อย'
        messageDOM.className = 'message succes'
    } catch(error) {
        console.log('error message', error.message)
        console.log('error',error.errors)
       // if (error.response) {
       //     console.log(error.response.data.message)
       // }
        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        html += '</div>'

        messageDOM.innerText = 'บันทึกข้อมูลไม่สำเร็จ'
        messageDOM.className = 'message danger'
    }

}
