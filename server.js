require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/lead', async (req, res) => {

    try {

        const { name, whats, insta } = req.body;

        console.log('Novo lead:', {
            name,
            whats,
            insta
        });

        const payload = [
            {
                name: `Lead - ${name}`,

                _embedded: {
                    contacts: [
                        {
                            first_name: name,

                            custom_fields_values: [

                                // TELEFONE
                                {
                                    field_code: 'PHONE',
                                    values: [
                                        {
                                            value: whats
                                        }
                                    ]
                                },

                                // INSTAGRAM
                                {
                                    field_id: Number(process.env.KOMMO_INSTAGRAM_FIELD_ID),
                                    values: [
                                        {
                                            value: insta
                                        }
                                    ]
                                }

                            ]
                        }
                    ]
                }
            }
        ];

        console.log(
            JSON.stringify(payload, null, 2)
        );

        const response = await axios.post(
            `https://${process.env.KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/complex`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Resposta Kommo:', response.data);

        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {

        console.log(
            'ERRO KOMMO:',
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando → http://localhost:3000');
});