const PAYMENT_URL = 'https://payfast.greenn.com.br/8r8ve8e';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('leadForm');

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-cta]').forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitText = form.querySelector('button[type="submit"] span:first-child');

        const data = {
            name: document.getElementById('f-name').value.trim(),
            whats: document.getElementById('f-whats').value.replace(/\D/g, ''),
            insta: document.getElementById('f-insta').value.trim().replace(/^@+/, '')
        };

        submitText.textContent = 'Enviando...';

        try {
            await axios.post('/api/lead', data);
            window.location.href = PAYMENT_URL;
        } catch (error) {
            console.error(error);
            submitText.textContent = 'Tentar novamente';
            alert('Erro ao enviar lead');
        }
    });
});