let app = new Vue({
    el: "#app",
    data: {
      lessons: [], // List of lessons fetched from API
      cart: [], // Items added to the cart
      showCart: false, // Toggle between lessons view and cart view
      sortAttribute: "subject", // Sorting criteria
      sortOrder: "asc", // Sorting order
      searchQuery: "", // Search query input
      checkout: {
        name: "",
        phone: "",
      },
      loading: true, // Loading indicator for fetching lessons
      nameError: "", // Error message for name validation
      phoneError: "", // Error message for phone validation
    },
    computed: {
      // Enable checkout button only if name and phone are valid
      isCheckoutEnabled() {
        const nameValid = /^[a-zA-Z\s]+$/.test(this.checkout.name);
        const phoneValid = /^[0-9]+$/.test(this.checkout.phone);
        return nameValid && phoneValid;
      },
    },
    methods: {
      filteredLessons() {
        this.fetchProducts(); // Ensure this is called whenever searchQuery changes
        return this.lessons;
      },
  
      // Fetch lessons from the API
      fetchProducts: async function () {
        try {
          // Build the query URL with search parameters
          const response = await fetch(
            `https://express-js-qwj4.onrender.com/collections/courses/search?search=${this.searchQuery}&sortKey=${this.sortAttribute}&sortOrder=${this.sortOrder}`
          );
  
          // Parse and update the lessons array
          if (response.ok) {
            const data = await response.json();
            this.lessons = data;
            this.sortLessons(); // Sort the lessons based on the selected criteria
            console.log("Fetched lessons:", this.lessons);
          } else {
            console.error("Failed to fetch products:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
        finally {
            this.loading = false;
        }
      },
  
      // Sort the lessons based on selected attribute and order
      sortLessons() {
        const sortOrder = this.sortOrder === "asc" ? 1 : -1; // Ascending or descending order
        this.lessons.sort((a, b) => {
          // Compare based on the selected sort key (e.g., subject, location, price, etc.)
          if (a[this.sortAttribute] < b[this.sortAttribute]) {
            return -sortOrder;
          }
          if (a[this.sortAttribute] > b[this.sortAttribute]) {
            return sortOrder;
          }
          return 0;
        });
      },
  
      // Add a lesson to the cart
      addToCart(lesson) {
        const existingLesson = this.cart.find(item => item.id === lesson.id);
        if (existingLesson) {
          // Increment the count if lesson is already in the cart
          existingLesson.count += 1;
        } else {
          // Add a new object with all lesson details and count = 1
          this.cart.push({
            id: lesson.id,
            subject: lesson.subject,
            location: lesson.location,
            price: lesson.price,
            image: lesson.image,
            count: 1,
          });
        }
        lesson.spaces--; // Decrement available spaces
      },
  
      // Remove a lesson from the cart
      removeFromCart(lesson) {
        const existingLesson = this.cart.find(item => item.id === lesson.id);
        if (existingLesson) {
          existingLesson.count -= 1; // Decrease the count
          if (existingLesson.count === 0) {
            // Remove from cart if count is 0
            this.cart = this.cart.filter(item => item.id !== lesson.id);
          }
          lesson.spaces++; // Increment available spaces
        }
      },
  
      // Toggle between cart and lessons page
      toggleCartPage() {
        this.showCart = !this.showCart;
      },
  
      // Validate name
      validateName() {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!this.checkout.name) {
          this.nameError = "Name is required.";
        } else if (!nameRegex.test(this.checkout.name)) {
          this.nameError = "Name must contain only letters.";
        } else {
          this.nameError = ""; // Clear the error if valid
        }
      },
  
      // Validate phone
      validatePhone() {
        const phoneRegex = /^[0-9]+$/;
        if (!this.checkout.phone) {
          this.phoneError = "Phone number is required.";
        } else if (!phoneRegex.test(this.checkout.phone)) {
          this.phoneError = "Phone must contain only numbers.";
        } else {
          this.phoneError = ""; // Clear the error if valid
        }
      },
  
      // Handle checkout
      checkoutForm: async function () {
        if (this.isCheckoutEnabled) {
          // First alert indicating that the order has been submitted
          alert(`Order submitted with ${this.cart.length} items. Thank you!`);
  
          const orderData = {
            name: this.checkout.name,
            phone: this.checkout.phone,
            courses: this.cart.reduce((acc, lesson) => {
              // Check if the lesson is already in the accumulator
              const existingLesson = acc.find(item => item.id === lesson.id);
              if (existingLesson) {
                // If found, increment the count
                existingLesson.count += 1;
              } else {
                // If not found, add a new object with id and count
                acc.push({
                  id: lesson.id,
                  count: 1,
                });
              }
              return acc; // Return the updated accumulator
            }, []), // Initialize with an empty array
          };
          console.log(orderData);
  
          try {
            // Make POST request to submit the order
            const response = await fetch(
              'https://express-js-qwj4.onrender.com/collections/Orders',
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
              }
            );
  
            // Handle the response from the order submission
            const result = await response.json();
  
            if (response.ok) {
              // If the order submission was successful, handle inventory update
              alert("Order submitted successfully!");
  
              try {
                // Update inventory in the backend
                const inventoryUpdateResponse = await fetch(
                  "https://express-js-qwj4.onrender.com/collections/products",
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      lessons: this.cart.map((lesson) => ({
                        title: lesson.title,
                        quantity: 1, // Adjust quantity as needed
                      })),
                    }),
                  }
                );
  
                // Handle the response for inventory update
                if (inventoryUpdateResponse.ok) {
                  console.log("Inventory updated successfully!");
                } else {
                  console.error(
                    "Failed to update inventory:",
                    await inventoryUpdateResponse.text()
                  );
                }
              } catch (error) {
                alert("Failed to update inventory.");
                console.error("Error updating inventory:", error);
              }
  
              // Reset checkout form and cart if everything is successful
              this.checkout = {
                name: "",
                phone: "",
              };
              this.cart = [];
              this.showCart = false;
            } else {
              // Handle error if order submission failed
              alert("Error submitting order: " + result.error);
            }
          } catch (error) {
            // Handle any errors during the order submission process
            alert("Failed to submit order.");
            console.error("Error submitting order:", error);
          }
        }
      },
    },
    mounted() {
      // Fetch lessons when the app is mounted
      this.fetchProducts();
    },
  });
  