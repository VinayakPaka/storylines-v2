import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Story } from '../../types/Story';
import LoadingScreen from '../../components/layout/LoadingScreen';
import { fetchFilteredStories } from '../../services/storyAPI';
import { sanitizeHtml } from '../../utils/htmlSanitizer';
import { Card, CardContent } from "../../components/ui/card";
import { IconArrowLeft, IconArrowRight, IconUser, IconTag, IconCalendar } from '@tabler/icons-react';

const DisplayStory: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [story, setStory] = useState<Story | null>(null);
    const [fetchedStories, setFetchedStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (location.state as Story) {
            setStory(location.state as Story);
        }
    }, [location.state]);

    useEffect(() => {
        if (story) {
            const relatedStories = [...story.prev, ...story.next];
            const fetchStories = async () => {
                try {
                    setIsLoading(true);
                    const storiesToFetch = await fetchFilteredStories(relatedStories);
                    setFetchedStories(storiesToFetch);
                } catch (error) {
                    setError("Unable to fetch related stories");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStories();
        }
    }, [story]);

    const prevStories = fetchedStories.filter(fetchedStory => story?.prev.includes(fetchedStory._id));
    const nextStories = fetchedStories.filter(fetchedStory => story?.next.includes(fetchedStory._id));

    const handleStoryClick = (clickedStory: Story) => {
        navigate(`/story`, { state: clickedStory });
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-20">{error}</div>;
    }

    if (!story) {
        return <div className="text-center mt-20">No story found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16 md:mt-24">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3 space-y-6">
                    <Link
                        to={`/story-map/${story.themeRoomId}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <IconArrowLeft className="w-4 h-4" />
                        Back to Theme Room
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{story.title}</h1>
                    {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <IconUser className="w-4 h-4" />
                            <span>{story.authorId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconCalendar className="w-4 h-4" />
                            <span>Updated recently</span>
                        </div>
                    </div> */}
                    <div className="prose prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(story.content) }} />
                    </div>
                </div>
                <div className="w-full md:w-1/3 space-y-8">
                    {/* <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold">Theme Room Details</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <IconTag className="w-4 h-4" />
                                <span>{story.themeRoomId}</span>
                            </div>
                            <Link
                                to={`/story-map/${story.themeRoomId}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                            >
                                View Theme Room
                                <IconArrowRight className="w-4 h-4" />
                            </Link>
                        </CardContent>
                    </Card> */}
                    {/* {prevStories.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Previous Stories</h3>
                            {prevStories.map((prevStory) => (
                                <Card key={prevStory._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 space-y-2">
                                        <h4 className="text-lg font-medium">{prevStory.title}</h4>
                                        <button
                                            onClick={() => handleStoryClick(prevStory)}
                                            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                                        >
                                            Read More
                                        </button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )} */}
                    {/* {nextStories.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Next Stories</h3>
                            {nextStories.map((nextStory) => (
                                <Card key={nextStory._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 space-y-2">
                                        <h4 className="text-lg font-medium">{nextStory.title}</h4>
                                        <button
                                            onClick={() => handleStoryClick(nextStory)}
                                            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                                        >
                                            Read More
                                        </button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default DisplayStory;