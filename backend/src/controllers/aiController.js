const aiController = {
    // Chat with AI assistant
    async chatWithAI(req, res) {
        try {
            const { message, conversationId } = req.body;

            if (!message) {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required'
                });
            }

            // Mock AI responses for testing
            const mockResponses = {
                algebra: `## Understanding Algebra

Algebra is a branch of mathematics that uses symbols (usually letters) to represent unknown numbers or variables. Here's a simple breakdown:

**What is Algebra?**
- Algebra helps us solve problems by finding unknown values
- We use letters like x, y, z to represent numbers we don't know yet
- The goal is to "solve for" these unknown values

**Basic Example:**
If x + 3 = 7, what is x?
- We can subtract 3 from both sides: x + 3 - 3 = 7 - 3
- This gives us: x = 4

**Why is it Important?**
- 🎯 Problem-solving skills
- 📊 Understanding patterns and relationships
- 🔬 Foundation for advanced math and science
- 💼 Used in many careers (engineering, finance, etc.)

Would you like me to explain any specific algebra concept?`,

                equation: `## Solving Linear Equations

Here's a step-by-step approach to solving linear equations:

**Steps:**
1. **Simplify both sides** - Remove parentheses and combine like terms
2. **Move variables to one side** - Add or subtract terms
3. **Isolate the variable** - Divide or multiply to get the variable alone

**Example: 2x + 5 = 13**
1. Subtract 5 from both sides: 2x = 8
2. Divide both sides by 2: x = 4
3. Check: 2(4) + 5 = 13 ✓

Need help with a specific equation?`,

                math: `## Mathematics Help Available

I can assist you with various math topics:

**Algebra:**
- Solving equations
- Working with variables
- Factoring and expanding

**Geometry:**
- Area and perimeter calculations
- Angle relationships
- Coordinate geometry

**Statistics:**
- Mean, median, mode
- Data analysis
- Probability basics

What specific math topic would you like to explore?`,

                default: `Hello! I'm your AI learning assistant. I can help you with:

📚 **Mathematics Topics:**
- Algebra and equations
- Functions and graphing  
- Geometry concepts
- Statistics and probability

💡 **Study Support:**
- Step-by-step problem solving
- Concept explanations
- Practice strategies
- Homework help

🚀 **Learning Features:**
- Interactive explanations
- Practice problems
- Study tips
- Progress tracking

What would you like to learn about today? Try asking about "algebra", "equations", or any math topic!`
            };

            // Determine response based on message content
            const messageLower = message.toLowerCase();
            let response = mockResponses.default;

            if (messageLower.includes('algebra')) {
                response = mockResponses.algebra;
            } else if (messageLower.includes('equation') || messageLower.includes('solve')) {
                response = mockResponses.equation;
            } else if (messageLower.includes('math') || messageLower.includes('mathematics')) {
                response = mockResponses.math;
            }

            // Simulate processing delay for realistic feel
            await new Promise(resolve => setTimeout(resolve, 1000));

            res.json({
                success: true,
                reply: response,
                conversationId: conversationId || `conv_${Date.now()}`,
                metadata: {
                    processingTime: 1000,
                    confidence: 0.95,
                    topic: messageLower.includes('algebra') ? 'algebra' :
                        messageLower.includes('equation') ? 'equations' : 'general'
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Chat with AI error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process AI request',
                details: error.message
            });
        }
    },

    // Get conversation history (simplified for testing)
    async getConversationHistory(req, res) {
        try {
            const { conversationId } = req.params;

            // Return empty history for now
            res.json({
                success: true,
                data: {
                    conversationId: conversationId,
                    messages: [],
                    metadata: {
                        totalMessages: 0,
                        createdAt: new Date().toISOString()
                    }
                }
            });
        } catch (error) {
            console.error('Get conversation history error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to load conversation history',
                details: error.message
            });
        }
    }
};

module.exports = aiController;
