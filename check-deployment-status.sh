#!/bin/bash

# Quick deployment status checker

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          Kolam OTT - QA Deployment Status                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if terraform is running
if pgrep -x "terraform" > /dev/null; then
    echo "🟢 Terraform is running..."
    echo ""

    # Show recent progress
    echo "📊 Recent Progress:"
    cd infrastructure/terraform
    tail -10 terraform-apply.log 2>/dev/null | grep -E "Creation complete|Still creating|Creating" | tail -5
    echo ""

    # Count completed resources
    COMPLETED=$(grep -c "Creation complete" terraform-apply.log 2>/dev/null || echo "0")
    echo "✅ Resources Created: $COMPLETED / 55"
    echo ""

    # Estimate time remaining
    if [ "$COMPLETED" -gt 0 ]; then
        PERCENTAGE=$((COMPLETED * 100 / 55))
        echo "📈 Progress: ${PERCENTAGE}%"

        if [ "$PERCENTAGE" -lt 30 ]; then
            echo "⏱️  Estimated time remaining: 10-12 minutes"
        elif [ "$PERCENTAGE" -lt 70 ]; then
            echo "⏱️  Estimated time remaining: 5-8 minutes"
        else
            echo "⏱️  Estimated time remaining: 2-3 minutes"
        fi
    fi
    echo ""

else
    # Check if deployment completed
    cd infrastructure/terraform 2>/dev/null

    if [ -f "terraform-apply.log" ]; then
        if grep -q "Apply complete!" terraform-apply.log; then
            echo "✅ Infrastructure deployment COMPLETED!"
            echo ""

            # Show completion stats
            grep "Apply complete!" terraform-apply.log
            echo ""

            echo "📋 Next Steps:"
            echo "  1. Install Docker Desktop (if not already installed)"
            echo "  2. Retrieve infrastructure outputs:"
            echo "     cd infrastructure/terraform && terraform output"
            echo "  3. Update environment files with the outputs"
            echo "  4. Deploy applications:"
            echo "     cd ../.. && ./infrastructure/scripts/deploy-qa.sh all"
            echo ""

        elif grep -q "Error:" terraform-apply.log; then
            echo "❌ Deployment encountered errors"
            echo ""
            echo "Last few log entries:"
            tail -20 terraform-apply.log | grep -A5 "Error:"
            echo ""
            echo "Check full logs: infrastructure/terraform/terraform-apply.log"

        else
            echo "ℹ️  Terraform not currently running"
            echo ""
            echo "Check logs: infrastructure/terraform/terraform-apply.log"
        fi
    else
        echo "ℹ️  No deployment in progress"
        echo ""
        echo "To start deployment:"
        echo "  cd infrastructure/terraform"
        echo "  terraform apply tfplan"
    fi
fi

echo ""
echo "─────────────────────────────────────────────────────────────"

# Check Docker status
echo ""
echo "🐳 Docker Status:"
if command -v docker &> /dev/null; then
    if docker ps &> /dev/null; then
        echo "   ✅ Docker is installed and running"
        docker --version
    else
        echo "   ⚠️  Docker is installed but not running"
        echo "   Start Docker Desktop to continue"
    fi
else
    echo "   ❌ Docker is not installed"
    echo "   Download: https://www.docker.com/products/docker-desktop"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
