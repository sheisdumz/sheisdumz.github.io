new Vue({
    el: '#app',
    data: {
        lessons: [
            { id: 1, subject: 'MATHEMATICS', location: 'Room 10', price: 2000, spaces: 10, icon: 'fas fa-calculator' },
            { id: 2, subject: 'ENGLISH LANGUAGE', location: 'Room 12', price: 1500, spaces: 8, icon: 'fas fa-flask' },
            { id: 3, subject: 'CURRENT AFFAIRS', location: 'Room 14', price: 1500, spaces: 5, icon: 'fas fa-landmark' },
            { id: 4, subject: 'BUSINESS MANAGEMENT', location: 'Room 16', price: 1800, spaces: 8, icon: 'fas fa-paint-brush' },
            { id: 5, subject: 'HEALTH SCIENCES', location: 'Room 18', price: 3000, spaces: 10, icon: 'fas fa-music' },
            { id: 6, subject: 'HISTORY', location: 'Room 20', price: 1500, spaces: 7, icon: 'fas fa-dumbbell' },
            { id: 7, subject: 'SOCIAL SCIENCES', location: 'Room 22', price: 1000, spaces: 25, icon: 'fas fa-laptop-code' },
            { id: 8, subject: 'ACCOUNTING', location: 'Room 24', price: 3000, spaces: 18, icon: 'fas fa-theater-masks' },
            { id: 9, subject: 'ITALIAN LANGUAGE', location: 'Room 26', price: 2000, spaces: 10, icon: 'fas fa-language' },
            { id: 10, subject: 'FRENCH LANGUAGE', location: 'Room 28', price: 2500, spaces: 7, icon: 'fas fa-language' }
        ],
        cart: [],
        sortAttribute: 'subject',
        sortOrder: 'asc',
        name: '',
        phone: '',
        nameError: '',
        phoneError: ''
    },
    computed: {
        sortedLessons() {
            return this.lessons.slice().sort((a, b) => {
                let modifier = this.sortOrder === 'asc' ? 1 : -1;
                if (a[this.sortAttribute] < b[this.sortAttribute]) return -1 * modifier;
                if (a[this.sortAttribute] > b[this.sortAttribute]) return 1 * modifier;
                return 0;
            });
        },
        isFormValid() {
            return (
                !this.nameError && 
                !this.phoneError && 
                this.name.trim() !== '' && 
                this.phone.trim() !== ''
            );
        }
    },
    methods: {
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push({ ...lesson });
                lesson.spaces--;
            }
        },
        validateName() {
            const nameRegex = /^[a-zA-Z\s]+$/;
            this.nameError = nameRegex.test(this.name)
                ? ''
                : 'Name must contain only letters.';
        },
        validatePhone() {
            const phoneRegex = /^[0-9]+$/;
            this.phoneError = phoneRegex.test(this.phone)
                ? ''
                : 'Phone must contain only numbers.';
        },
        checkout() {
            alert(`Order submitted with ${this.cart.length} items. Thank you!`);
            this.cart = [];
            this.name = '';
            this.phone = '';
        }
    }
});