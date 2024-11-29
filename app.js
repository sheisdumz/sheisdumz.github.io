let app = new Vue({
    el: '#app',
    data: {
        lessons: [],        // List of lessons fetched from API
        cart: [],           // Items added to the cart
        showCart: false,    // Toggle between lessons view and cart view
        sortAttribute: 'subject',  // Sorting criteria  
        sortKey: 'title',
        sortOrder: 'asc',   // Sorting order
        searchQuery: '',    // Search query input
        name: '',           // User's name input
        phone: '',          // User's phone input
        nameError: '',      // Validation error for name
        phoneError: '',     // Validation error for phone
        checkout: {
            name: "",
            phone: "",
        },
        loading: true       // Loading indicator for fetching lessons
    },
    computed: {
        filteredLessons() {
            // const query = this.searchQuery.toLowerCase();

            // return this.lessons
            //     .filter(lesson => {
            //         const matchesSubject = lesson.subject.toLowerCase().includes(query);
            //         const matchesLocation = lesson.location.toLowerCase().includes(query);
            //         const matchesPrice = lesson.price.toString().includes(query);
            //         const matchesSpaces = lesson.spaces.toString().includes(query);

            //         return matchesSubject || matchesLocation || matchesPrice || matchesSpaces;
            //     })
            //     .sort((a, b) => {
            //         let modifier = this.sortOrder === 'asc' ? 1 : -1;
            //         if (a[this.sortAttribute] < b[this.sortAttribute]) return -1 * modifier;
            //         if (a[this.sortAttribute] > b[this.sortAttribute]) return 1 * modifier;
            //         return 0;
            //     });
            this.fetchProducts(); // Ensure this is called whenever `searchQuery` changes
            return this.lessons;
        },
        // Enable checkout button only if name and phone are valid
        isCheckoutEnabled() {
            const nameValid = /^[a-zA-Z\s]+$/.test(this.name);
            const phoneValid = /^[0-9]+$/.test(this.phone);
            return nameValid && phoneValid;
        }
    },
    methods: {
        // Fetch lessons from the API
        fetchProducts: async function () {
            try {
              // Build the query URL with search and sorting parameters
              const response = await fetch(
                `https://express-js-qwj4.onrender.com/collections/courses/search?search=${this.searchQuery}&sortKey=${this.sortKey}&sortOrder=${this.sortOrder}`
              );
          
              // Parse and update the lessons array
              if (response.ok) {
                this.lessons = await response.json();
                console.log('Fetched lessons:', this.lessons);
              } else {
                console.error('Failed to fetch products:', await response.text());
              }
            } catch (error) {
              console.error('Error fetching products:', error);
            }
          }
          ,
        // Add a lesson to the cart
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push(lesson);
                lesson.spaces--;
            }
        },
        // Remove a lesson from the cart
        removeFromCart(lesson) {
            const index = this.cart.indexOf(lesson);
            if (index > -1) {
                this.cart.splice(index, 1);
                lesson.spaces++;
            }
        },
        // Toggle between cart and lessons page
        toggleCartPage() {
            this.showCart = !this.showCart;
        },
        // Validate name input
        validateName() {
            const nameRegex = /^[a-zA-Z\s]+$/;
            this.nameError = nameRegex.test(this.name)
                ? ''
                : 'Name must contain only letters.';
        },
        // Validate phone input
        validatePhone() {
            const phoneRegex = /^[0-9]+$/;
            this.phoneError = phoneRegex.test(this.phone)
                ? ''
                : 'Phone must contain only numbers.';
        },
        // Handle checkout
        checkoutForm: async function () {
            if (this.isCheckoutEnabled) {
                alert(`Order submitted with ${this.cart.length} items. Thank you!`);
                const orderData = {
                    name: this.checkout.name,
                    phone: this.checkout.phone,
                    courses: this.cart.map(lesson => ({
                        title: lesson.title,

                    }))

                };

                                    try {

                        const response = await fetch('https://express-js-qwj4.onrender.com/collections/orders', {

                            method: 'POST',

                            headers: {

                                'Content-Type': 'application/json'

                            },

                            body: JSON.stringify(orderData)

                        });

                        const result = await response.json();

                        if (response.ok) {

                            alert('Order submitted successfully!');
                            try {
        
                                // Update inventory in the backend
        
                                const inventoryUpdateResponse = await fetch('https://express-js-qwj4.onrender.com/collections/products/updateSpace', {
        
                                    method: 'PUT',
        
                                    headers: {
        
                                        'Content-Type': 'application/json'
        
                                    },
        
                                    body: JSON.stringify({ lessons: this.cart.map(lesson => ({ title: lesson.title, quantity: 1 })) })
        
                                });
        
         
        
                                if (inventoryUpdateResponse.ok) {
        
                                    console.log('Inventory updated successfully!');
        
                                } else {
        
                                    console.error('Failed to update inventory:', await inventoryUpdateResponse.text());
        
                                }
        
         
        
                                const result = await response.json();
        
                                if (response.ok) {
        
                                    alert('Order submitted successfully!');
                                    // Reset checkout form
                                    this.checkout = {
                                        name: '',
                                        phone: ''
                                    };
                                    // Clear the cart and return to the main page
        
                                    this.cart = [];
                                    this.showCart = false;
        
                                } else {
        
                                    alert('Error submitting order: ' + result.error);
        
                                }
        
                            } catch (error) {
        
                                alert('Failed to submit order.');
        
                            }
                            // Clear the cart and return to the main page
                            this.cart = [];
                            this.showCart = false;
                        } else {
                            alert('Error submitting order: ' + result.error);
                        }
                    } catch (error) {
                        alert('Failed to submit order.');
                    }
            }
        }
    },
    mounted() {
        // Fetch lessons when the app is mounted
        this.fetchProducts();
    }
});