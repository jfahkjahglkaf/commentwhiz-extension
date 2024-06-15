import React, { useState, useEffect } from "react";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { Divider } from "../components/Divider";
import { Bottom } from "../components/Bottom";
import { Loader } from "../components/Loader";
import { Response } from "../components/Response";
import  Rating from "../components/Rating";
import axios from "axios";

function Extension() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    useEffect(() => {}, [loading, response]);
    const [overallRatings, setOverallRatings] = useState(null);
    
    function checkIfProductPage() {
        chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, async (response) => {
            if (response.url) {
                const url = response.url;
                const isAmazonProductPage = /^https?:\/\/(www\.)?amazon\.[a-z\.]{2,6}(\/d\/|\/dp\/|\/gp\/product\/)/.test(url);
                //const isProductPage = /\/(\d+|[a-z0-9-]+)$/.test(url);  // work in progress for other product pages (e.g. ebay, walmart, etc.) 
                const disableButton = !isAmazonProductPage;
                return disableButton;
            }
        }
        )}

    const runScrapingScript = async () => {
        setOverallRatings(null);
        setResponse("");
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, async (response) => { 
            if (response.url) {
                try {
                    // Step 1: Use async/await with axios.post
                    const res = await axios.post('http://localhost:3000/scrape', { url: response.url });
                    console.log('URL sent successfully:', res.data);
    
                    // Step 2: Extract the "overall_ratings" value
                    const Enhanced_Rating = res.data['Enhanced Rating'];
                    if (Enhanced_Rating !== undefined) {
                        setOverallRatings(Enhanced_Rating); // Step 3: Store the value
                    }
                    if (res.data['reviews'] !== undefined) {
                        const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
                        const reviews = res.data['reviews'];
                        const prompt = `Analyze the following comments for the product at ${response.url} and provide a summary and recommendation: ${reviews}`;
                        const resp = await axios.post('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
                            prompt,
                            max_tokens: 150
                          }, 
                          {
                            headers: {
                              'Authorization': `Bearer ${openAiApiKey}`,
                              'Content-Type': 'application/json'
                            }
                          });
                          if (resp.data && resp.data.choices && resp.data.choices.length > 0) {
                            const plainTextResponse = resp.data.choices[0].text.trim(); //extract plaintext and trims trailing whitespace
                            setLoading(false);
                            setResponse(plainTextResponse); // Store the plain text response
                            } 
                            else {
                                console.error('No response text found');
                                setLoading(false);
                                setResponse('No response text found');
                            }
                    }
                } catch (err) {
                    setLoading(false);
                    setResponse(err);

                }
            }
        });
    };
    
    const onClick = () => {
        runScrapingScript();
        // add integration parts  
    } 

    return (
        <Container.Outer customStyles={{ backgroundColor: 'lime-700' }} showIcon={true} showHeader={true}>
            <Container.Inner customStyles={{ backgroundColor: '#e0e0e0', padding: 50, borderRadius: '3rem', minHeight: '500px' }}>
                <Button onClick={onClick} disabled={checkIfProductPage} text="Scan comments now!" />
                <Divider />
                {loading ? <Loader /> : <Response response={response} />}
                <Rating rating={overallRatings} /> 
                <Bottom />
            </Container.Inner>
        </Container.Outer>
    );
    
    
}

export default Extension;
