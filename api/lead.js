const axios = require('axios');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { name, whats, insta } = req.body;

        const instagramFieldId = 1888772;

        const payload = [
            {
                name: `Lead - ${name}`,

                // CASO O CAMPO INSTAGRAM SEJA DE LEAD
                custom_fields_values: [
                    {
                        field_id: instagramFieldId,
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
                                },

                                // CASO O CAMPO INSTAGRAM SEJA DE CONTATO
                                {
                                    field_id: instagramFieldId,
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

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('ERRO KOMMO:', JSON.stringify(error.response?.data || error.message, null, 2));

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
};