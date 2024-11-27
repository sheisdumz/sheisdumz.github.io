let app = new Vue({
    el: '#app',
    data: {
        lessons: [],
        cart: [],
        showCart: false,
        sortAttribute: 'subject',
        sortOrder: 'asc',
        name: '',
        phone: '',
        nameError: '',
        phoneError: '',
        loading: true 
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
        isCheckoutEnabled() {
            const nameValid = /^[a-zA-Z\s]+$/.test(this.name);
            const phoneValid = /^[0-9]+$/.test(this.phone);
            return nameValid && phoneValid;
        }
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await fetch(
                    `https://express-js-qwj4.onrender.com/collections/courses`
                );
                if (response.ok) {
                    this.lessons = await response.json();
                    console.log('Fetched courses:', this.lessons);
                } else {
                    console.error('Failed to fetch courses:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                this.loading = false;
            }
        },
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push(lesson);
                lesson.spaces--;
            }
        },
        removeFromCart(lesson) {
            const index = this.cart.indexOf(lesson);
            if (index > -1) {
                this.cart.splice(index, 1);
                lesson.spaces++;
            }
        },
        toggleCartPage() {
            this.showCart = !this.showCart;
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
            if (this.isCheckoutEnabled) {
                alert(`Order submitted with ${this.cart.length} items. Thank you!`);
                this.cart = [];
                this.name = '';
                this.phone = '';
                this.showCart = false;
            }
        }
    },
    mounted() {
        this.fetchProducts();
    }
});