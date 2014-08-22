if=$(route get 0.0.0.0 2>/dev/null | awk '/interface: / {print $2}')

if [ -n "$if" ]; then
    echo "Default route is through interface $if"
else
    echo "No default route found"
fi