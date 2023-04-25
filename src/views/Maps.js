import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { Card, Button } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Route } from "react-router-dom";

const { Meta } = Card;
const socket = io("ws://localhost:5000");

function Maps() {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [biddingAmount, setBiddingAmount] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isTimeLeft, setIsTimeLeft] = useState(false);
  const [timeleft, setTimeleft] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  // const countdown = (productId, endTime) => {
  //   const now = new Date().getTime();
  //   const distance = endTime - now;

  //   console.log(distance,"distance");

  //   // Calculate remaining minutes and seconds
  //   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //   // Set the remaining time left in the timeLeft state variable
  //   setTimeLeft((prevTimeLeft) => ({
  //     ...prevTimeLeft,
  //     [productId]: `${minutes}m ${seconds}s`,
  //   }));

  //   // If the countdown is over, remove the product from the timeLeft state variable
  //   if (distance < 0) {
  //     setTimeLeft((prevTimeLeft) => {
  //       const { [productId]: removedProduct, ...rest } = prevTimeLeft;
  //       return rest;
  //     });
  //   }
  // };

  // console.log(timeLeft,"timeleft");
  // const myDate = "2023-04-23T10:30:00.000Z";
  // const dateObj = new Date(Date.parse(timeLeft));
  // console.log(dateObj);
  // console.log(timeLeft);
  const handleClick = () => {
    setShowDetails(true);
  };

  const countdown = (productId, endDate) => {
    const date1 = new Date(endDate);
    const date2 = Date.now();

    const diffInMs = date1 - date2;

    console.log(diffInMs, "diff");
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const remainingMinutes = diffInMinutes % 60;

    const diffString = `${diffInHours} hours, ${remainingMinutes} minutes`;
    setTimeleft(diffString);
    if (date1 == date2 || date1 < date2) setIsTimeLeft(true);
    console.log(diffString);
  };
  useEffect(() => {
    let timer;
    if (currentProduct) {
      const { biddingEndTime } = currentProduct;
      countdown(currentProduct._id, biddingEndTime);

      // Update the time left every second
      timer = setInterval(
        () => countdown(currentProduct._id, biddingEndTime),
        1000
      );
    }
    return () => clearInterval(timer);
  }, [currentProduct]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/").then((response) => {
      setProducts(response.data);
    });
  }, []);

  // useEffect(() => {
  //   // Listen for new bids and update the product list in real-time
  //   socket.on("newBid", ({ productId, user, amount }) => {
  //     setProducts((prevProducts) =>
  //       prevProducts.map((product) =>
  //         product._id === productId
  //           ? {
  //               ...product,
  //               currentPrice: amount,
  //               bids: [...product.bids, { user, amount }],
  //             }
  //           : product
  //       )
  //     );
  //   });

  //   // Listen for winner notifications
  //   socket.on("winner", ({ productId, user }) => {
  //     setWinner({ productId, user });
  //     setCurrentProduct(null);
  //   });

  //   // Clean up Socket.IO listeners
  //   return () => {
  //     socket.off("newBid");
  //     socket.off("winner");
  //   };
  // }, []);

  // useEffect(() => {
  //   // Fetch products from server when component mounts
  //   fetch("/api/products")
  //     .then((response) => response.json())
  //     .then((data) => setProducts(data));
  // }, []);

  const handleProductSelect = (product) => {
    setCurrentProduct(product);
    setWinner(null);
    console.log(product);
  };

  const handleBiddingAmountChange = (event) => {
    setBiddingAmount(Number(event.target.value));
  };

  const handleBidSubmit = () => {
    socket.emit("bid", {
      productId: currentProduct._id,
      userId: "64124730022147aecf137014", // Replace with the actual user ID
      amount: biddingAmount,
    });
    socket.on("newBid", ({ productId, user, amount }) => {
      let productToBid = currentProduct;
      productToBid.bids.push({ user, amount });
      setCurrentProduct(productToBid);
    });
    setBiddingAmount(0);
  };

  const handleEndBidding = () => {
    socket.emit("endBidding", currentProduct._id);
  };

  return (
<Container class="bg-image">
      <Container maxWidth="sm">
       
        
      </Container>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col span={12} md={6} lg={4} key={product._id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={`../..${product.imageUrl}`}
                  style={{ height: 250 }}
                />
              }
              actions={[]}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Meta
                  title={product.name}
                  description={`${product.description} - ${product.currentPrice}`}
                  style={{ height: 100, overflow: "hidden" }}
                />
                <Button type="text" onClick={handleClick} icon={<HeartOutlined />} />
              </div>
              <div
                style={{
                  backgroundColor: "#01182c14",
                  height: 53,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    height: 53,
                    width: 60,
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <div style={{ marginTop: 17 }}>BID</div>
                  <div className={"auction-anchor"}></div>
                </div>
                <div style={{ marginRight: 10 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: "bold", color: "#555" }}
                  >
                    Current Bid
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    ${product.currentPrice}
                  </div>
                </div>
              </div>
              <Button onClick={() => handleProductSelect(product)}>
                Select
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
     
      {currentProduct && (
        <div>
          <h2>{currentProduct.name}</h2>
          <p>Current price: {currentProduct.currentPrice}</p>
        
          <p>Time left: {isTimeLeft ? "Auction has ended" : timeleft}</p>
          {/* Display the remaining time left */}
          <h3>Bids</h3>
          <ul>
            {currentProduct.bids.map((bid, index) => (
              <li key={index}>
                {bid.user} - {bid.amount}
              </li>
            ))}
          </ul>
          <div>
            <input
              type="number"
              value={biddingAmount}
              onChange={handleBiddingAmountChange}
            />
            <Button onClick={handleBidSubmit}>Submit bid</Button>
          </div>
          {/* <Button onClick={handleEndBidding}>End bidding</Button> */}
        </div>
      )}
      {winner && (
        <div>
          <h2>Congratulations!</h2>
          <p>You won the bidding for {winner.productId}!</p>
        </div>
      )}
    </Container>
  );
}

export default Maps;
