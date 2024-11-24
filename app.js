let app = new Vue({
    el: '#app',
    data: {
        lessons: [],
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
        fetchProducts: async function () {
            try {
                const response = await fetch(
                    `https://express-js-qwj4.onrender.com/collections/courses`
                );
        
                if (response.ok) {
                    this.lessons = await response.json();  // Assign to this.lessons
                    console.log('Fetched courses:', this.lessons);
                } else {
                    console.error('Failed to fetch courses:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        },
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
    },
    mounted: function () {
        this.fetchProducts();
    }
});