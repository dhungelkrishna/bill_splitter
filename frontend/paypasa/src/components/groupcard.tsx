import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowUp, ArrowDown } from "lucide-react";

interface GroupCardProps {
  groupName: string;
  members: string[];
  balance: number;
}

export default function GroupCard({ groupName, members, balance }: GroupCardProps) {
  const isPositive = balance >= 0;

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-gray-500" />
          <div>
            <h3 className="text-lg font-semibold">{groupName}</h3>
            <p className="text-sm text-gray-500">{members.length} members</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-lg font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            Rs. {Math.abs(balance).toFixed(2)}
          </span>
          {isPositive ? (
            <ArrowUp className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDown className="h-5 w-5 text-red-600" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

