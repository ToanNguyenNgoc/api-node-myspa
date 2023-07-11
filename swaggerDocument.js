const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'BTX Trends APIs Document',
        description: 'BTX Trends APIs Document',
        termsOfService: '',
        contact: {
            name: 'Nguyen Ngoc Toan',
            email: 'toan@gmail.com',
            url: 'https://google.com'
        },
        license: {
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    apis: ["./routes/*.js"],
}
module.exports = swaggerDocument