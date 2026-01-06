import Post from '../models/Post.js';

// @desc    Get all posts for current user
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create/Schedule a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  const { content, platforms, scheduledAt, aiGenerated } = req.body;
  try {
    const post = await Post.create({
      user: req.user._id,
      content,
      platforms,
      scheduledAt,
      aiGenerated
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Simulate AI content generation
// @route   POST /api/posts/generate
// @access  Private
export const generateAIContent = async (req, res) => {
  const { pillar } = req.body;
  
  const drafts = {
    'Agency Growth': "🚀 Transforming your agency's output with $DEGN Engine. Our new AI Growth module just hit 10k leads/hr. #AgencyScale #SaaS",
    'Conversion Design': "🎨 Design isn't just how it looks, it's how it converts. The new glassmorphic components in Devign Engine are driving 40% higher CTR. #UIUX #Growth",
    'Automation Alpha': "🤖 Stop manual outreach. Our autonomous scraper is now live. Let the bots handle the research while you close deals. #Automation #GrowthHacking"
  };

  const content = drafts[pillar] || "Drafting high-conversion content for your next campaign...";

  try {
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
