import { FunctionComponent, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

import { CurrencyFormatter } from "../CurrencyFormatter";
import classes from "./products.module.scss";
import { Loader } from "../Loader";
import axios from "axios";

const API_URL = "http://3.7.252.58:4001/product/getAllProduct";

export type Product = {
  _id: string;
  name: string;
  slugName: string;
  price: number;
  productBrandId: string;
  productCategoryId: string;
  discountAmount: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  __v: number;
  quantity: number;
};

export interface CartProps {
  [productId: string]: Product;
}

export const Products: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [cart, setCart] = useLocalStorageState<CartProps>("cart", {});

  useEffect(() => {
    fetchData(API_URL);
  }, []);

  async function fetchData(url: string) {
    const headers = {
      "Content-Type": "application/json",
      Cookie:
        "connect.sid=s%253AC9UlQ9M1W1aslddIqBNrrk68Yx4GleaF.OyLqPkC%252FpbJKf070EG6KIJoS70bHaP5GOYXBXBV6hG8",
    };

    const requestData = {
      limit: 100,
      page: 0,
      search: "",
    };
    try {
      const response = await axios.post(url, requestData, {
        headers,
      });
      if (response.status === 200) {
        setProducts(response.data);
        setIsLoading(false);
      } else {
        setError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  }

  const addToCart = (product: Product): void => {
    product.quantity = 1;

    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: product,
    }));
  };

  const isInCart = (productId: string): boolean =>
    Object.keys(cart || {}).includes(productId);

  if (error) {
    return (
      <h3 className={classes.error}>
        An error occurred when fetching data. Please check the API and try
        again.
      </h3>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={classes.productPage}>
      <h1>Products</h1>

      <div className={classes.container}>
        {products.map((product) => (
          <div className={classes.product} key={product._id}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>
              Price: <CurrencyFormatter amount={product.price} />
            </p>
            <button
              disabled={isInCart(product._id)}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
