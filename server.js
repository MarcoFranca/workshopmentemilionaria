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

        // ENVIO PRO KOMMO
        const response = await axios.post(
            `https://${process.env.KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/complex`,
            [
                {
                    name: `Lead - ${name}`,

                    custom_fields_values: [
                        {
                            field_id: Number(process.env.KOMMO_INSTAGRAM_FIELD_ID),
                            values: [
                                {
                                    value: insta
                                }
                            ]
                        }
                    ],

                    _embedded: {
                        contacts: [
                            {
                                first_name: name,

                                custom_fields_values: [
                                    {
                                        field_code: 'PHONE',
                                        values: [
                                            {
                                                value: whats
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            {
                headers: {
                    Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando → http://localhost:3000');
});