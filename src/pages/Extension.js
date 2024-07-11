import React, { useState, useEffect } from "react";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { Divider } from "../components/Divider";
import { Bottom } from "../components/Bottom";
import { Loader } from "../components/Loader";
import { Footer } from "../components/Footer";
import { Response } from "../components/Response";
import { Showcase } from "../components/Showcase";
import { Rating } from "../components/Rating";
import axios from "axios";

function Extension() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    useEffect(() => {}, [loading, response]);
    const [overallRatings, setOverallRatings] = useState(null);
    console.log("Rendering Extension1");
    function isValidUrl(url) {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch (error) {
          // The URL constructor throws a TypeError if the URL is invalid
          return false;
        }
    }
    
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

    function cleanAmazonUrl(url) {
        try {
            // Create a URL object
            let urlObj = new URL(url);

            // Extract the path parts
            let pathParts = urlObj.pathname.split('/');

            // Find the ASIN (usually after "/dp/")
            let asinIndex = pathParts.indexOf('dp');
            if (asinIndex === -1 || asinIndex + 1 >= pathParts.length) {
                throw new Error("ASIN not found");
            }

            let asin = pathParts[asinIndex + 1];

            // Construct the clean URL
            let cleanUrl = `${urlObj.origin}/dp/${asin}`;

            return cleanUrl;
        } catch (error) {
            console.error(error.message);
            return url;  // Return the original URL if an error occurs
        }
    }

    const runScrapingScript = async () => {
        setOverallRatings(null);
        setResponse("");
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, async (response) => { 
            if (response.url && isValidUrl(response.url) {
                try {
                    // Clean the URL before sending
                    const cleanUrl = cleanAmazonUrl(response.url);

                    // Step 1: Use async/await with axios.post
<<<<<<< HEAD
                    const res = await axios.post('http://localhost:3001/scrape', { url: response.url });
=======
                    const res = await axios.post('https://localhost:3001/scrape', { url: cleanUrl });
>>>>>>> 524c21d2ff01ff134456c764841bafeb0fe3fc75
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

    console.log("Rendering Extension2");

    return (
        <Container.Outer className="flex flex-col min-h-screen" showIcon={true} showHeader={true} customStyles={{ minWidth: '300px', width: '100%', maxWidth: '400px', margin: '0 auto', maxHeight: '400px'}}>
            <Container.Inner className="flex flex-col flex-grow p-4" customStyles={{ padding: 40, borderRadius: '3rem', minHeight: '350px', maxHeight: '350px' }}>
                <Button onClick={onClick} text="Scan comments now!" className="w-full py-4 text-xl font-bold text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <Divider />
                <div className="flex-grow">
                    {loading ? <Loader /> : <Response response={response} />}
                    <Rating rating={overallRatings} />
                </div>
                <div className="mt-auto">
                    <Bottom />
                </div>
            </Container.Inner>
            <Footer />
        </Container.Outer>
    );
}

export default Extension;
