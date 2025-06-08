import "./checkout.css";
import { useState, useEffect, useRef } from "react";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
function Checkout({ cart, setcart, dop }) {
  const [tp, settp] = useState(0);
  const [tdop, settdop] = useState(0);
  const [q, setq] = useState(0);
  const btn = useRef({});
  const btn1 = useRef({});
  useEffect(() => {
    let qq = 0;
    let ttp = 0;
    let j = 0;

    cart.forEach((element) => {
      qq += element.q;
      ttp += element.priceCents * element.q;
      const v = dop.find((d) => d.id === element.dop);
      if (v) {
        j += v.p;
      }
    });
    setq(qq);
    settp(ttp);
    settdop(j);
  }, [cart]);

  function remove(id) {
    const newc = cart.filter((i) => i.id != id);
    setcart(newc);
    localStorage.setItem("cart", JSON.stringify(newc));
  }
  function update(id) {
    if (btn1.current[id].innerHTML === "Save") {
      btn1.current[id].innerHTML = "Update";
      const o = Number(btn.current[id].value);
      const h = cart.map((y) => (y.id === id ? { ...y, q: o } : y));
      setcart(h);
      localStorage.setItem("cart", JSON.stringify(h));
      btn.current[id].disabled = true;
    } else {
      btn1.current[id].innerHTML = "Save";
      btn.current[id].disabled = false;
    }
    console.log(cart);
  }
  function onClickdop(dopp, id) {
    const h = cart.map((y) => (y.id === id ? { ...y, dop: dopp } : y));
    setcart(h);
    localStorage.setItem("cart", JSON.stringify(h));
    let k = 0;
    h.forEach((item) => {
      const v = dop.find((d) => d.id === item.dop);
      if (v) {
        k += v.p;
      }
    });
    settdop(k);
  }

  return (
    <div>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="amazon-logo" src="images/amazon-logo.png" />
              <img
                className="amazon-mobile-logo"
                src="images/amazon-mobile-logo.png"
              />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="amazon.html">
              {q} items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="mainc">
        <div className="page-title">Review your order</div>

        <div className="checkout-gridc">
          <div className="cart-item-container">
            {cart.map((item) => (
              <div key={item.id}>
                <div className="delivery-date">
                  Delivery date:{" "}
                  {item.dop === 1
                    ? dayjs().add(5, "day").format("dddd , MMMM D")
                    : item.dop === 2
                    ? dayjs().add(3, "day").format("dddd , MMMM D")
                    : item.dop === 3
                    ? dayjs().add(1, "day").format("dddd , MMMM D")
                    : "non"}
                </div>

                <div className="cart-item-details-grid">
                  <img
                    className="product-image"
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-item-details">
                    <div className="product-name">{item.name}</div>
                    <div className="product-price">
                      ${(item.priceCents / 100).toFixed(2)}
                    </div>
                    <div className="product-quantity">
                      <span>
                        Quantity:
                        <input
                          type="number"
                          disabled
                          className="quantity-label"
                          ref={(el) => (btn.current[item.id] = el)}
                          defaultValue={item.q}
                        />
                      </span>
                      <span
                        onClick={() => update(item.id)}
                        ref={(el) => (btn1.current[item.id] = el)}
                        className="update-quantity-link link-primary"
                      >
                        Update
                      </span>
                      <span
                        onClick={() => remove(item.id)}
                        className="delete-quantity-link link-primary"
                      >
                        Delete
                      </span>
                    </div>
                  </div>

                  <div className="delivery-options">
                    <div className="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    {dop.map((i) => (
                      <div className="delivery-option" key={i.id}>
                        <input
                          onClick={() => onClickdop(i.id, item.id)}
                          defaultChecked={i.id === item.dop}
                          type="radio"
                          className="delivery-option-input"
                          name={`delivery-option-${item.id}`}
                          min={1}
                        />
                        <div>
                          <div className="delivery-option-date">
                            {dayjs().add(i.day, "day").format("dddd , MMMM D")}
                          </div>
                          <div className="delivery-option-price">
                            {i.p === 0
                              ? "FREE Shipping"
                              : `${(i.p / 100).toFixed(2)}$`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <div className="payment-summary-title">Order Summary</div>

            <div className="payment-summary-row">
              <div>Items ({q}):</div>
              <div className="payment-summary-money">
                ${(tp / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">
                {tdop === 0 ? "FREE" : `$${(tdop / 100).toFixed(2)}`}
              </div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">
                ${((tp + tdop) / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">
                ${(((tp + tdop) * 0.1) / 100).toFixed(2)}
              </div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">
                ${(((tp + tdop) * 1.1) / 100).toFixed(2)}
              </div>
            </div>

            <button className="place-order-button button-primary">
              Place your order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
