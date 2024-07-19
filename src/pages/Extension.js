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
    const [overallRatings, setOverallRatings] = useState(null);
    const [amazonUrl, setAmazonUrl] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const checkIfButtonShouldBeDisabled = async () => {
            try {
                const result = await disableButton();
                setIsButtonDisabled(result);
            } catch (error) {
                console.error("Failed to get current tab URL", error);
                setIsButtonDisabled(true);
            }
        };
        checkIfButtonShouldBeDisabled();
    }, []);

    function isValidUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

    function disableButton() {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, (response) => {
                if (response.url) {
                    const url = response.url;
                    const urlObj = new URL(url);
                    const hostname = urlObj.hostname;
                    const isAmazonPage = hostname.includes('amazon');
                    const isShopeePage = hostname.includes('shopee');
                    resolve(!(isAmazonPage || isShopeePage));
                } else {
                    reject(new Error("Failed to get current tab URL"));
                }
            });
        });
    }

    function cleanProductUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            if (hostname.includes('amazon')) {
                return cleanAmazonUrl(urlObj);
            } else if (hostname.includes('shopee')) {
                return cleanShopeeUrl(urlObj);
            }

            return url;
        } catch (error) {
            console.error(error.message);
            return url;
        }
    }

    function cleanAmazonUrl(urlObj) {
        let pathParts = urlObj.pathname.split('/');
        let asinIndex = pathParts.indexOf('dp');
        if (asinIndex === -1 || asinIndex + 1 >= pathParts.length) {
            throw new Error("ASIN not found");
        }

        let asin = pathParts[asinIndex + 1];
        let cleanUrl = `${urlObj.origin}/dp/${asin}`;

        return cleanUrl;
    }

    function cleanShopeeUrl(urlObj) {
        let pathname = urlObj.pathname;
        let match = pathname.match(/i\.(\d+)\.(\d+)/);
        if (match) {
            let shopId = match[1];
            let itemId = match[2];
            return `${urlObj.origin}/product/${shopId}/${itemId}`;
        }

        return urlObj.href;
    }

    const runScrapingScript = async () => {
        setOverallRatings(null);
        setResponse("");
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, async (response) => {
            if (response.url && isValidUrl(response.url)) {
                try {
                    const cleanUrl = cleanProductUrl(response.url);
                    setAmazonUrl(cleanUrl);
                    const res = await axios.post('https://localhost:3001/api/scrape', { url: cleanUrl });
                    console.log('URL sent successfully:', res.data);

                    const Enhanced_Rating = res.data['Enhanced Rating'];
                    if (Enhanced_Rating !== undefined) {
                        setOverallRatings(Enhanced_Rating);
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
                            const plainTextResponse = resp.data.choices[0].text.trim();
                            setLoading(false);
                            setResponse(plainTextResponse);
                        } else {
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
    };

    return (
        <Container.Outer className="flex flex-col min-h-screen" showIcon={true} showHeader={true} customStyles={{ minWidth: '300px', width: '100%', maxWidth: '400px', margin: '0 auto', maxHeight: '400px' }}>
            <Container.Inner className="flex flex-col flex-grow p-4" customStyles={{ padding: 40, borderRadius: '3rem', minHeight: '350px', maxHeight: '350px' }}>
                <Button isdisabled={isButtonDisabled} onClick={onClick} text="Scan comments now!" className="w-full py-4 text-xl font-bold text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <Divider />
                <div className="flex-grow">
                    {loading ? <Loader /> : <Response response={response} />}
                    <Rating rating={overallRatings} />
                </div>
                <div className="mt-auto">
                    <Bottom tabURL={amazonUrl} />
                </div>
            </Container.Inner>
            <Footer />
        </Container.Outer>
    );
}

export default Extension;
