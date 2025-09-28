import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
const Home = ()=>{
    return(
        <>
            <div className="container mt-5">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1530631673369-bc20fdb32288?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};
export default Home;