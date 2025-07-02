import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Wallet,
  Receipt,
  Blocks,
  Fuel,
  Shield,
  Coins,
  FileText,
  Activity,
  Info,
  X,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  requiredParams: string[];
  optionalParams: string[];
  example: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  // Balance & Wallet Tools
  {
    id: 1,
    name: "getBalance",
    description: "Get ETH balance for an address",
    category: "Balance & Wallet",
    requiredParams: ["address"],
    optionalParams: [],
    example: "What's the ETH balance of 0x1234...?",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    id: 2,
    name: "getTokenBalance",
    description: "Get token balance for a specific contract",
    category: "Balance & Wallet",
    requiredParams: ["contractAddress", "address"],
    optionalParams: [],
    example: "Check token balance for token contract address 0xaf88d065e77c8cC2239327C5EDb3A432268e5831 for address 0x1234...",
    icon: <Coins className="w-4 h-4" />,
  },
  {
    id: 12,
    name: "getMultiBalance",
    description: "Get ETH balances for multiple addresses at once",
    category: "Balance & Wallet",
    requiredParams: ["addresses array"],
    optionalParams: [],
    example: "Get balances for these 5 addresses: 0x1234..., 0x5678...",
    icon: <Wallet className="w-4 h-4" />,
  },

  // Transaction Tools
  {
    id: 3,
    name: "getTransaction",
    description: "Get detailed transaction information",
    category: "Transactions",
    requiredParams: ["txHash"],
    optionalParams: [],
    example: "Show details for transaction 0xabc123...",
    icon: <Receipt className="w-4 h-4" />,
  },
  {
    id: 4,
    name: "getTransactionReceipt",
    description: "Get transaction receipt and execution details",
    category: "Transactions",
    requiredParams: ["txHash"],
    optionalParams: [],
    example: "Get receipt for tx 0xabc123...",
    icon: <Receipt className="w-4 h-4" />,
  },
  {
    id: 7,
    name: "getTransactionHistory",
    description: "Get transaction history for an address",
    category: "Transactions",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Show transaction history for 0x1234...",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 19,
    name: "getTransactionStatus",
    description: "Get transaction status and receipt",
    category: "Transactions",
    requiredParams: ["txHash"],
    optionalParams: [],
    example: "Is transaction 0xabc123... confirmed?",
    icon: <Activity className="w-4 h-4" />,
  },

  // Block Tools
  {
    id: 5,
    name: "getBlock",
    description: "Get block information by number",
    category: "Blocks",
    requiredParams: [],
    optionalParams: ["blockNumber"],
    example: "Show me block 18500000 details",
    icon: <Blocks className="w-4 h-4" />,
  },
  {
    id: 6,
    name: "getLatestBlock",
    description: "Get the latest block number and info",
    category: "Blocks",
    requiredParams: [],
    optionalParams: [],
    example: "What's the latest block number?",
    icon: <Blocks className="w-4 h-4" />,
  },

  // Gas & Network Tools
  {
    id: 9,
    name: "getGasPrice",
    description: "Get current gas price",
    category: "Gas & Network",
    requiredParams: [],
    optionalParams: [],
    example: "What's the current gas price?",
    icon: <Fuel className="w-4 h-4" />,
  },
  {
    id: 18,
    name: "getGasOracle",
    description: "Get gas price recommendations (safe/standard/fast)",
    category: "Gas & Network",
    requiredParams: [],
    optionalParams: [],
    example: "What are the recommended gas prices?",
    icon: <Fuel className="w-4 h-4" />,
  },
  {
    id: 10,
    name: "getEthSupply",
    description: "Get total ETH supply information",
    category: "Gas & Network",
    requiredParams: [],
    optionalParams: [],
    example: "What's the total ETH supply?",
    icon: <Info className="w-4 h-4" />,
  },

  // Contract Tools
  {
    id: 8,
    name: "getContractAbi",
    description: "Get contract ABI for interaction",
    category: "Smart Contracts",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Get ABI for contract 0x1234...",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 16,
    name: "getContractSource",
    description: "Get verified contract source code",
    category: "Smart Contracts",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Show source code for contract 0x1234...",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 20,
    name: "getContractCreation",
    description: "Get contract creation transaction details",
    category: "Smart Contracts",
    requiredParams: ["contractAddresses array"],
    optionalParams: [],
    example: "When was contract 0x1234... created?",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 21,
    name: "getAddressType",
    description: "Check if address is contract or EOA",
    category: "Smart Contracts",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Is 0x1234... a contract or wallet?",
    icon: <Shield className="w-4 h-4" />,
  },

  // Token & Transfer Tools
  {
    id: 13,
    name: "getERC20Transfers",
    description: "Get ERC-20 token transfer history",
    category: "Tokens & Transfers",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Show token transfers for 0x1234...",
    icon: <Coins className="w-4 h-4" />,
  },
  {
    id: 14,
    name: "getERC721Transfers",
    description: "Get ERC-721 NFT transfer history",
    category: "Tokens & Transfers",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Show NFT transfers for 0x1234...",
    icon: <Coins className="w-4 h-4" />,
  },
  {
    id: 15,
    name: "getInternalTransactions",
    description: "Get internal transaction history",
    category: "Tokens & Transfers",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Show internal txs for 0x1234...",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 17,
    name: "getTokenInfo",
    description: "Get detailed token information and metadata",
    category: "Tokens & Transfers",
    requiredParams: ["contractAddress"],
    optionalParams: [],
    example: "Get info for token contract 0x1234...",
    icon: <Info className="w-4 h-4" />,
  },

  // Utility Tools
  {
    id: 11,
    name: "validateAddress",
    description: "Validate Ethereum address format",
    category: "Utilities",
    requiredParams: ["address"],
    optionalParams: [],
    example: "Is 0x1234... a valid address?",
    icon: <Shield className="w-4 h-4" />,
  },
];

const categories = [
  "Balance & Wallet",
  "Transactions",
  "Blocks",
  "Gas & Network",
  "Smart Contracts",
  "Tokens & Transfers",
  "Utilities",
];

interface ToolsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolsGuide({ isOpen, onClose }: ToolsGuideProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
      // Ensure modal starts at top
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const copyToClipboard = async (text: string, toolName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedExample(toolName);
      toast({
        title: "Copied!",
        description: `Example copied to clipboard: "${text}"`,
        duration: 2000,
      });
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getCategoryTools = (category: string) => {
    return tools.filter((tool) => tool.category === category);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Balance & Wallet": "bg-blue-100 text-blue-800 border-blue-300",
      Transactions: "bg-green-100 text-green-800 border-green-300",
      Blocks: "bg-purple-100 text-purple-800 border-purple-300",
      "Gas & Network": "bg-orange-100 text-orange-800 border-orange-300",
      "Smart Contracts": "bg-red-100 text-red-800 border-red-300",
      "Tokens & Transfers": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Utilities: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] overflow-hidden"
      style={{ zIndex: 99999 }}
      onClick={handleBackdropClick}
    >
      <div className="h-full w-full flex items-start justify-center p-4 pt-8 overflow-y-auto">
        <div className="w-full max-w-4xl min-h-fit">
          <Card className="w-full bg-white shadow-2xl border-2 border-blue-300 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold text-white mb-1">
                    🛠️ Blockchain Analysis Tools Guide
                  </CardTitle>
                  <p className="text-blue-100 text-sm">
                    Discover 21+ powerful tools for analyzing Arbitrum
                    blockchain data
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-4 hover:bg-white/20 text-white border-2 border-white/40 hover:border-white/60 px-4 py-2 rounded-lg transition-all duration-200 flex-shrink-0"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-gray-50 max-h-[70vh] overflow-y-auto">
              <div className="bg-white rounded-lg p-4 mb-6 border border-blue-200 shadow-sm">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-lg">
                  💡 How to Use These Tools
                </h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong>Natural Language:</strong> Simply ask: "What's the
                      balance of 0x1234...?"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong>Copy Examples:</strong> Click the copy icon next
                      to any example to use it directly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong>Combine Requests:</strong> "Check balance and
                      transaction history for 0x1234..."
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong>Real Data:</strong> Use actual addresses,
                      transaction hashes, or contract addresses
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 pb-6">
                {categories.map((category) => {
                  const categoryTools = getCategoryTools(category);
                  const isExpanded = expandedCategory === category;

                  return (
                    <Collapsible
                      key={category}
                      open={isExpanded}
                      onOpenChange={() => toggleCategory(category)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto hover:bg-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-white shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <Badge
                              className={`${getCategoryColor(
                                category
                              )} font-medium px-3 py-1 text-sm`}
                            >
                              {categoryTools.length} tools
                            </Badge>
                            <span className="font-semibold text-gray-800 text-lg">
                              {category}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-3 space-y-3">
                        {categoryTools.map((tool) => (
                          <Card
                            key={tool.id}
                            className="ml-4 border-l-4 border-l-blue-400 bg-white shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="text-blue-600 mt-1 p-2 bg-blue-50 rounded-lg flex-shrink-0">
                                  {tool.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-3 mb-3 flex-wrap">
                                    <code className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md text-sm font-mono font-semibold">
                                      {tool.name}
                                    </code>
                                    {tool.requiredParams.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-red-300 text-red-700 flex-shrink-0"
                                      >
                                        Required params
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-gray-700 mb-3 font-medium leading-relaxed text-sm">
                                    {tool.description}
                                  </p>

                                  {tool.requiredParams.length > 0 && (
                                    <div className="mb-3">
                                      <span className="text-xs font-semibold text-gray-600 block mb-1">
                                        Required:
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {tool.requiredParams.map(
                                          (param, idx) => (
                                            <code
                                              key={idx}
                                              className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-mono"
                                            >
                                              {param}
                                            </code>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {tool.optionalParams.length > 0 && (
                                    <div className="mb-3">
                                      <span className="text-xs font-semibold text-gray-600 block mb-1">
                                        Optional:
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {tool.optionalParams.map(
                                          (param, idx) => (
                                            <code
                                              key={idx}
                                              className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-mono"
                                            >
                                              {param}
                                            </code>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-3 mt-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <span className="text-xs font-semibold text-green-700 block mb-1">
                                          Example:
                                        </span>
                                        <span className="text-sm text-green-600 font-medium italic break-words">
                                          "{tool.example}"
                                        </span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="ml-2 h-8 w-8 p-0 hover:bg-green-100 flex-shrink-0 transition-all duration-200"
                                        onClick={() =>
                                          copyToClipboard(
                                            tool.example,
                                            tool.name
                                          )
                                        }
                                        title="Copy example to clipboard"
                                      >
                                        {copiedExample === tool.name ? (
                                          <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                          <Copy className="w-4 h-4 text-green-600" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
