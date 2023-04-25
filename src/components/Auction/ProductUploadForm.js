import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

function ProductUploadForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [biddingEndTime, setBiddingEndTime] = useState("");
  const [products, setProducts] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    /*
      route accepts an object with the following key-value pairs
      don't use a formData obj
      just send the obj as is, just like in the POSTMAN
    */
    
    const data = {
      name,
      description,
      imageUrl,
      startingPrice,
      currentPrice,
      biddingEndTime,
    };

    addProduct(data);
  };

  const addProduct = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/",
        formData
      );

      // POST requests generate a 201 HTTP response code rather than 200
      if (response.status === 201) {
        const product = response.data;
        console.log(response);
        setProducts([...products, product]);
        alert("Product added successfully!");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  return (
    <Container>
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>Product Form</h2>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="productName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter product description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productImageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productStartingPrice">
          <Form.Label>Starting Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter starting price"
            value={startingPrice}
            onChange={(event) => setStartingPrice(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="productCurrentPrice">
          <Form.Label>Current Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter current price"
            value={currentPrice}
            onChange={(event) => setCurrentPrice(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productBiddingEndTime">
          <Form.Label>Bidding End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="Enter bidding end time"
            value={biddingEndTime}
            onChange={(event) => setBiddingEndTime(event.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.startinPrice}
          </li>
        ))}
      </ul>
    </Container>
  );
}
export default ProductUploadForm;