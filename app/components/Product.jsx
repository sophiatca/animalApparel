import React, { Component, PropTypes } from 'react'

import { Grid, Row, Col, Form,
         Thumbnail, Button, FormControl,
         FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import { addCartItemAndGetUpdatedCart } from '../reducers/action-creators/cart'
import RelatedProducts from './RelatedProducts'
import Reviews from './Reviews'
import ReviewForm from './ReviewForm'

export default class Product extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selectedItem: {},
      selectedQuantity: '',
    }
    this.addToCart = this.addToCart.bind(this)
    this.sizeClicked = this.sizeClicked.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getValidationState = this.getValidationState.bind(this)
  }

  addToCart(event) {
    event.preventDefault()
    const item = {
      orderItem: {
        size: this.state.selectedItem.size,
        quantity: this.state.selectedQuantity
      },
      product_id: this.props.currentProduct.id,
      order_id: this.props.order_id ? this.props.order_id : null
    }
    this.props.dispatch(addCartItemAndGetUpdatedCart(item))
  }

  sizeClicked (event, item) {
    event.preventDefault()
    this.setState({
      selectedItem: item
    })
  }

  getValidationState() {
    const quantity = this.state.selectedQuantity
    const stock = this.state.selectedItem.quantity
    if (quantity > stock || quantity < 0) return 'error'
    else if (quantity > 0 && quantity <= stock) return 'success'
    else if (quantity === 0) return 'warning'
  }

  handleChange(event) {
    this.setState({ selectedQuantity: event.target.value });
  }

  render() {
    const product = this.props.currentProduct
    return  (
      <Grid fluid={true}>
        <Row>
         <Col xs={12} sm={12} md={6} lg={6}>
           <Thumbnail
             className="product-detail"
             src={ product.imageURL } alt={`${product.name} photo`} />
         </Col>
         <Col xs={12} sm={12} md={6} lg={6}>
           <Row className="product-detail">
             <h2>{ product.name }</h2>
           </Row>
           <Row className="product-detail">
             <p>{ `$${product.price}` }</p>
           </Row>
           <Row className="product-detail">
             <h3>Size:</h3>
              { product.inventories && (
                  product.inventories.sort((a, b) => a.id > b.id).map(inventory =>
                    <Button
                      key={inventory.id}
                      type="button"
                      className="size-thumbnail"
                      onClick={(event) => this.sizeClicked(event, inventory)}
                      disabled={ inventory.quantity < 0}>
                      { inventory.size }
                    </Button>
                  )
                )
              }
           </Row>
           <Row className="product-detail">
             <Form>
               <FormGroup
                 controlId="quantity"
                 validationState={this.getValidationState()}>
                 <ControlLabel>Quantity:</ControlLabel>
                 <FormControl
                   value={this.state.selectedQuantity}
                   placeholder="Enter Quantity"
                   onChange={this.handleChange}/>
                 <HelpBlock>
                   {`Only ${this.state.selectedItem.quantity} left`}
                 </HelpBlock>
               </FormGroup>
             </Form>
           </Row>
           <Button className="product-detail" bsStyle="primary" bsSize="large" type="submit" onClick={this.addToCart}>{
              this.props.loading ? 'Adding to bag...' : 'Add to Bag'
             }</Button>
             {/*
               <Col xs={12} sm={12} md={6} lg={6}>
               <Button bsSize="large">
                 <Glyphicon glyph="heart" /> Add to Wishlist!
               </Button>
             </Col>
               */}
           <Row className="product-detail" >
             <h3>Description:</h3>
             <p>{product.description}</p>
           </Row>
         </Col>
        </Row>
        <Row className="product-reviews">
          <h3>Reviews</h3>
        </Row>
        <Reviews reviews={this.props.currentProduct.reviews} />
        <ReviewForm dispatch={this.props.dispatch} handleAddReview={this.props.handleAddReview} currentProduct={this.props.currentProduct} />
        <RelatedProducts relatedProducts={this.props.relatedProducts} />
      </Grid>
    )
  }
}

Product.propTypes = {
  currentProduct: PropTypes.object.isRequired,
  relatedProducts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  handleAddReview: PropTypes.func.isRequired
}
